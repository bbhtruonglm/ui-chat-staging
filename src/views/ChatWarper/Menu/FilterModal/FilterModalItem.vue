<template>
    <div :class="{ 'bg-orange-100': is_active }"
        class="flex items-center border-b py-2 px-2 hover:bg-orange-100 rounded-lg mb-2 cursor-pointer">
        <div>
            <img :src="icon">
        </div>
        <div class="ml-1 font-medium w-[calc(100%_-_36px)] truncate">
            {{ title }}
        </div>
        <div class="absolute right-[24px]">
            <img src="@/assets/icons/arrow-right.svg">
        </div>
    </div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{
    /**icon của item */
    icon: string
    /**tiêu đề của item */
    title: string
    /**item này có đang được kích hoạt hay không */
    is_active?: boolean
}>(), {})
</script>