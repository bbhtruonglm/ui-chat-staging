<template>
  <button class="text-sm font-medium w-fit">
    {{ $t('v1.view.main.dashboard.chat.post.get_more_comments') }}
    <template v-if="count">({{ count }})</template>
  </button>
</template>
<script setup lang="ts">
const $props = withDefaults(
  defineProps<{
    count?: number
  }>(),
  {}
)
</script>
