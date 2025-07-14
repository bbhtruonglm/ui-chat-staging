<template>
    <div :class="is_disable ? 'opacity-50' : 'cursor-pointer'" class="p-2 border-b hover:bg-orange-100">
        <div class="flex items-center justify-between">
            <div class="w-5 h-5 rounded-full mr-3" :style="{ 'background': label?.bg_color }">
            </div>
            <div class="w-[calc(100%_-_52px)] truncate text-sm">
                {{ label?.title }}
            </div>
            <div class="w-5 h-5">
                <img v-if="is_selected" class="" src="@/assets/icons/check-circle.svg">
            </div>
        </div>
        <div v-if="Object.keys(pageStore.selected_page_id_list).length > 1"
            class="text-xs text-slate-400 break-words mt-1">
            {{ getPageName(getPageInfo(label?.fb_page_id)) }}
            -
            {{ label?.fb_page_id }}
        </div>
    </div>
</template>
<script setup lang="ts">
import { usePageStore } from '@/stores'
import { getPageInfo, getPageName } from '@/service/function'

import type { ILabel } from '@/service/interface/app/label'

const pageStore = usePageStore()

const $props = withDefaults(defineProps<{
    /**dữ liệu của nhãn */
    label?: ILabel
    /**nhãn có được chọn hay không */
    is_selected?: boolean
    /**nhãn có bị tắt hay không */
    is_disable?: boolean
}>(), {})
</script>