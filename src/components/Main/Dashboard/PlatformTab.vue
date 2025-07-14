<template>
    <div class="overflow-x-auto px-4 mt-1 h-[34px]">
        <div class="flex w-max">
            <div @click="selectTab(key as string)"
                class="font-semibold px-4 py-1 cursor-pointer border-b-2 border-white text-slate-400 hover:border-orange-500 hover:font-semibold hover:text-black"
                :class="{ '!text-black !border-orange-500': modelValue === key }" v-for="(tab, key) of  platform_list">
                <span>{{ tab.title }}</span>
                <span v-if="tab.count" :class="{ '!text-white !bg-orange-500': modelValue === key }"
                    class="ml-2 bg-slate-300 text-xs px-1 rounded">
                    {{ tab.count }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { TabPlatform } from '@/service/interface/app/page'

const $emit = defineEmits(['update:modelValue'])

withDefaults(defineProps<{
    /**danh sách các nền tảng */
    platform_list: TabPlatform
    /**giá trị của v-model được truyền vào */
    modelValue?: string
}>(), {})

/**chọn 1 nền tảng */
function selectTab(key: string) {
    $emit('update:modelValue', key)
}
</script>