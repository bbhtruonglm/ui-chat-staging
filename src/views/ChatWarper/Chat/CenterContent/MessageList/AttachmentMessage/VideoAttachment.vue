<template>
  <video
    class="rounded-lg w-56 h-32"
    controls
    preload="metadata"
  >
    <source
      :src="url"
      type="video/mp4"
    />
  </video>
</template>
<script setup lang="ts">
const $props = withDefaults(
  defineProps<{
    /**đường link ảnh */
    url?: string
  }>(),
  {}
)
</script>
