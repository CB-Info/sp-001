<script setup lang="ts">
import type { Photo } from '~/types/cap';
import variants from '~/data/image-variants.json';

/**
 * Une photo de la série « nuit » : <picture> avec ses variantes pré-générées
 * (AVIF, WebP, JPEG ; scripts/build-images.mjs), le recadrage dirigé sous 48em
 * quand il existe, et une plaque de chargement de 24 px en fond (aucune case
 * vide pendant le chargement). Le grain est posé en CSS (.cap-photo::after).
 *
 * `mobileCrop: false` sert la plaque entière à toutes les largeurs.
 */
const props = withDefaults(
  defineProps<{
    photo: Photo;
    sizes?: string;
    sizesMobile?: string;
    loading?: 'lazy' | 'eager';
    priority?: boolean;
    introMedia?: boolean;
    mobileCrop?: boolean;
    alt?: string;
    tag?: 'div' | 'figure';
  }>(),
  {
    sizes: '100vw',
    sizesMobile: '100vw',
    loading: 'lazy',
    priority: false,
    introMedia: false,
    mobileCrop: true,
    alt: undefined,
    tag: 'div',
  },
);

type Entry = {
  width: number;
  height: number;
  widths: number[];
  hash: string;
  placeholder?: string;
};
const manifest = variants as Record<string, Entry>;
const $img = useImage();
const MOBILE = '(max-width: 47.99em)';

function srcset(src: string, format: 'avif' | 'webp' | 'jpg') {
  const widths = manifest[src]?.widths ?? [];
  return widths.map((width) => `${$img(src, { width, format })} ${width}w`).join(', ');
}

const crop = computed(() => (props.mobileCrop ? props.photo.mobile : undefined));

const sources = computed(() => {
  const list: { media?: string; type: string; srcset: string; sizes: string }[] = [];
  for (const format of ['avif', 'webp'] as const) {
    if (crop.value) {
      list.push({
        media: MOBILE,
        type: `image/${format}`,
        srcset: srcset(crop.value.src, format),
        sizes: props.sizesMobile,
      });
    }
    list.push({
      type: `image/${format}`,
      srcset: srcset(props.photo.src, format),
      sizes: props.sizes,
    });
  }
  return list;
});

const placeholder = (src?: string) => {
  const data = src ? manifest[src]?.placeholder : undefined;
  return data ? `url("${data}")` : 'none';
};

const style = computed(() => ({
  '--placeholder': placeholder(props.photo.src),
  '--placeholder-m': placeholder(crop.value?.src ?? props.photo.src),
  '--focal': props.photo.focal ?? '50% 50%',
}));
</script>

<template>
  <component :is="tag" class="cap-photo" :class="{ 'cap-photo--crop': crop }" :style="style">
    <picture class="cap-photo__picture">
      <source
        v-for="source in sources"
        :key="`${source.type}-${source.media ?? 'all'}`"
        :media="source.media"
        :type="source.type"
        :srcset="source.srcset"
        :sizes="source.sizes"
      />
      <img
        class="cap-photo__img"
        :src="$img(photo.src, { width: 1280, format: 'jpg' })"
        :srcset="srcset(photo.src, 'jpg')"
        :sizes="sizes"
        :width="photo.width"
        :height="photo.height"
        :alt="alt ?? photo.alt"
        :loading="loading"
        :fetchpriority="priority ? 'high' : undefined"
        decoding="async"
        :data-intro-media="introMedia ? '' : undefined"
      />
    </picture>
    <slot />
  </component>
</template>

<style scoped>
.cap-photo {
  background-image: var(--placeholder);
}

.cap-photo__picture {
  display: contents;
}

.cap-photo__img {
  object-position: var(--focal);
}

@media (max-width: 47.99em) {
  .cap-photo--crop {
    background-image: var(--placeholder-m);
  }

  .cap-photo--crop .cap-photo__img {
    object-position: 50% 50%;
  }
}
</style>
