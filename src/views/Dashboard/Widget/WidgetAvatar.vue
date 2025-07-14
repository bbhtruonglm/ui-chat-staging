<template>
  <img @error="onImageError" :src />
</template>
<script setup lang="ts">
import DefaultImg from '@/assets/imgs/chatbox.svg'

const $props = withDefaults(
  defineProps<{
    /**link ảnh */
    src?: string
  }>(),
  {}
)

/**khi ảnh load thất bại thì thay thế ảnh mặc định vào */
function onImageError($event: Event) {
  /**thẻ img */
  const IMG = $event.target as HTMLImageElement

  // thay link ảnh mặc định vào
  IMG.src = DefaultImg
}
</script>
