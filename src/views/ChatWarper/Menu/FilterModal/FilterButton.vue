<template>
    <div>
        <button :class="type" class="font-medium w-full border-2 rounded-full py-2">
            {{ title }}
        </button>
    </div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{
    type: string
    /**title của item */
    title: string
}>(), {})
</script>