<template>
    <div class="mt-3 text-sm text-slate-500">
        {{ title }}
    </div>
</template>
<script setup lang="ts">
const $props = withDefaults(defineProps<{
    /**giá trị widget đang chọn */
    title: string
}>(), {})
</script>