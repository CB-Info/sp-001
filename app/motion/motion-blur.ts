import { hasFinePointer } from './env';

/**
 * Overdrive O1 (docs/analyse/annexes/a6-motion.md §7) : la photo du hero filée à
 * l'horizontale par le GPU quand elle « bouge » (défilement, pointeur), le langage
 * photographique de la marque. Au repos, le canvas est masqué : on voit la photo
 * elle-même (<img>, élément LCP), jamais une copie.
 *
 * Réservé aux appareils qui le portent sans peine ; ailleurs, la plaque de stries
 * en CSS fait le même geste.
 */

/** Pas de calcul : le flou est une boîte le long de l'axe, échantillonnée TAPS fois. */
const TAPS = 20;
/** Plus forte longueur de filé, en fraction de la largeur de la photo. */
const BLUR_MAX = 0.05;
/**
 * Entre ces deux intensités, le canvas apparaît en fondu par-dessus la photo
 * nette : pas de saut de netteté quand le filé commence ou s'éteint.
 */
const FADE_FROM = 0.02;
const FADE_TO = 0.08;
/** Densité du canvas : le flou n'a pas besoin du plein écran Retina. */
const MAX_DPR = 1.5;

const VERTEX = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

/*
 * Flou de bougé : moyenne de la photo le long de l'horizontale, centrée sur le
 * pixel. Un bruit par pixel décale les échantillons (interleaved gradient noise) :
 * le filé reste continu au lieu de se dédoubler en TAPS copies.
 */
const FRAGMENT = /* glsl */ `
precision highp float;
uniform sampler2D tMap;
uniform vec2 uScale;
uniform vec2 uOffset;
uniform float uLength;
varying vec2 vUv;
const int TAPS = ${TAPS};
void main() {
  vec2 uv = vUv * uScale + uOffset;
  float jitter = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  vec3 color = vec3(0.0);
  for (int i = 0; i < TAPS; i++) {
    float t = (float(i) + jitter) / float(TAPS) - 0.5;
    color += texture2D(tMap, uv + vec2(t * uLength, 0.0)).rgb;
  }
  gl_FragColor = vec4(color / float(TAPS), 1.0);
}`;

type NavigatorHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

/**
 * L'appareil s'y prête : pointeur fin (ordinateur), au moins 4 cœurs et 4 Go de
 * mémoire quand le navigateur le dit, pas d'économie de données demandée.
 */
export function canBlur(): boolean {
  const hints = navigator as NavigatorHints;
  return (
    hasFinePointer() &&
    navigator.hardwareConcurrency >= 4 &&
    (hints.deviceMemory ?? 4) >= 4 &&
    !hints.connection?.saveData
  );
}

export interface MotionBlur {
  /** Filé de la photo, de 0 (net : canvas masqué) à 1 (BLUR_MAX). */
  draw(amount: number): void;
  destroy(): void;
}

/** Rendu WebGL sur le processeur : un flou plein écran y coûterait chaque image. */
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|software/i;

/**
 * Pose un canvas WebGL juste au-dessus de `photo`, dans `host`. Rend `undefined` si
 * le GPU est absent ou logiciel : le repli décide. failIfMajorPerformanceCaveat ne
 * suffit pas, certains navigateurs servent SwiftShader sans le signaler.
 * `onLost` est appelé si le contexte est perdu en cours de route.
 */
export async function createMotionBlur(
  photo: HTMLImageElement,
  host: HTMLElement,
  { onLost }: { onLost: () => void },
): Promise<MotionBlur | undefined> {
  const canvas = document.createElement('canvas');
  // Premier contexte demandé, il fixe les attributs : OGL réutilisera celui-ci.
  const context = canvas.getContext('webgl2', {
    alpha: false,
    depth: false,
    antialias: false,
    powerPreference: 'low-power',
    failIfMajorPerformanceCaveat: true,
  });
  if (!context) return undefined;
  const debug = context.getExtension('WEBGL_debug_renderer_info');
  if (
    debug &&
    SOFTWARE_RENDERER.test(String(context.getParameter(debug.UNMASKED_RENDERER_WEBGL)))
  ) {
    return undefined;
  }

  const { Renderer, Program, Mesh, Triangle, Texture } = await import('ogl');
  const renderer = new Renderer({ canvas, alpha: false, depth: false, webgl: 2 });
  const { gl } = renderer;
  const texture = new Texture(gl, { image: photo, generateMipmaps: true });
  const uniforms = {
    tMap: { value: texture },
    uScale: { value: [1, 1] },
    uOffset: { value: [0, 0] },
    uLength: { value: 0 },
  };
  const mesh = new Mesh(gl, {
    geometry: new Triangle(gl),
    program: new Program(gl, { vertex: VERTEX, fragment: FRAGMENT, uniforms }),
  });

  /**
   * object-fit: cover et object-position de la photo, relus à chaque taille : la
   * photo et le canvas coïncident, quel que soit le cadrage servi (portrait ou non).
   */
  function fit() {
    const [fx = 0.5, fy = 0.5] = getComputedStyle(photo)
      .objectPosition.split(' ')
      .map((value) => Number.parseFloat(value) / 100);
    const width = host.clientWidth;
    const height = host.clientHeight;
    renderer.dpr = Math.min(devicePixelRatio, MAX_DPR);
    renderer.setSize(width, height);
    const box = width / height;
    const image = photo.naturalWidth / photo.naturalHeight;
    const scaleX = box > image ? 1 : box / image;
    const scaleY = box > image ? image / box : 1;
    uniforms.uScale.value = [scaleX, scaleY];
    // Les UV de WebGL partent du bas : le point focal vertical se compte depuis le bas.
    uniforms.uOffset.value = [(1 - scaleX) * fx, (1 - scaleY) * (1 - fy)];
  }

  const resize = new ResizeObserver(fit);
  resize.observe(host);
  fit();

  let visible = false;
  const lost = (event: Event) => {
    event.preventDefault();
    onLost();
  };
  canvas.addEventListener('webglcontextlost', lost);
  canvas.className = 'hero__blur';
  canvas.setAttribute('aria-hidden', 'true');
  photo.closest('picture')?.after(canvas);

  return {
    draw(amount) {
      const opacity = Math.min(Math.max((amount - FADE_FROM) / (FADE_TO - FADE_FROM), 0), 1);
      if (opacity > 0 !== visible) {
        visible = opacity > 0;
        canvas.toggleAttribute('data-visible', visible);
      }
      if (!visible) return;
      canvas.style.opacity = opacity.toFixed(3);
      uniforms.uLength.value = amount * BLUR_MAX;
      renderer.render({ scene: mesh });
    },
    destroy() {
      resize.disconnect();
      canvas.removeEventListener('webglcontextlost', lost);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    },
  };
}
