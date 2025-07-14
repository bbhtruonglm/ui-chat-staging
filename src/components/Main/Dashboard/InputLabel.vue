<template>
    <div>
        <div class="text-sm text-slate-600">{{ title }}</div>
        <input :type="type" :placeholder="placeholder" @input="emitValue" class="w-full border-2 rounded py-1 px-2">
    </div>
</template>
<script setup lang="ts">
const $emit = defineEmits(['update:modelValue'])

withDefaults(defineProps<{
    /**v-model được truyền vào */
    modelValue?: any
    /**tiêu đề của input */
    title: string
    /**type của input */
    type?: string
    /**placeholder của input */
    placeholder?: string
}>(), {
    type: 'text'
})

/**emit ra v-model */
function emitValue($event: any) {
    $emit('update:modelValue', $event?.target?.value)
}
</script>