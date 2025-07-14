<template>
    <img v-if="url" :src="url" class="object-contain rounded-lg" />
</template>
<script setup lang="ts">
const $props = withDefaults(defineProps<{
    /**đường link ảnh */
    url?: string
}>(), {})
</script>