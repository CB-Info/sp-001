// Serveur statique minimal pour la sortie de `nuxt generate` (tests e2e, captures,
// Lighthouse). Sans dépendance : node:http suffit pour servir .output/public.
// Il compresse le texte en gzip comme tout hébergeur, pour des mesures réalistes.
// Usage : node scripts/serve-static.mjs [port] [dossier]
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { createGzip } from 'node:zlib';

const port = Number(process.argv[2] ?? 4173);
const root = resolve(process.argv[3] ?? '.output/public');

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

async function resolveFile(urlPath) {
  // normalize + préfixe : aucune requête ne sort du dossier servi.
  const path = join(root, normalize(decodeURIComponent(urlPath)));
  if (!path.startsWith(root)) return null;
  const info = await stat(path).catch(() => null);
  if (info?.isDirectory()) return resolveFile(join(urlPath, 'index.html'));
  return info?.isFile() ? path : null;
}

createServer(async (request, response) => {
  const { pathname } = new URL(request.url ?? '/', 'http://localhost');
  const file = (await resolveFile(pathname)) ?? (await resolveFile('/404.html'));
  if (!file) {
    response.writeHead(404).end();
    return;
  }
  const status = file.endsWith('404.html') && pathname !== '/404.html' ? 404 : 200;
  const type = types[extname(file)] ?? 'application/octet-stream';
  const gzip =
    /^(text\/|application\/json|image\/svg)/.test(type) &&
    /\bgzip\b/.test(request.headers['accept-encoding'] ?? '');
  response.writeHead(status, {
    'content-type': type,
    vary: 'accept-encoding',
    ...(gzip && { 'content-encoding': 'gzip' }),
  });
  const body = createReadStream(file);
  (gzip ? body.pipe(createGzip()) : body).pipe(response);
}).listen(port, () => console.log(`http://localhost:${port} → ${root}`));
