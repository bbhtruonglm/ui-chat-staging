<template>
    <audio class="w-56 h-16 " controls preload="metadata">
        <source :src="url" type="audio/mpeg">
    </audio>
</template>
<script setup lang="ts">
const $props = withDefaults(defineProps<{
    /**đường link ảnh */
    url?: string
}>(), {})
</script>