<template>
    <div class="relative">
        <div @click="is_show_select_page = !is_show_select_page"
            class="rounded-full h-[40px] border flex items-center cursor-pointer bg-white md:bg-slate-100">
            <div class="w-[calc(100%_-_25px)] flex items-center">
                <template v-if="selected_page">
                    <PageAvatar class="rounded-full ml-[6px] w-8 h-8"
                        :page_info="selected_page.page" :page_type="selected_page?.page?.type"
                        />
                    <div class="w-[calc(100%_-_36px)] px-2 truncate">
                        {{ selected_page?.page?.name }}
                    </div>
                </template>
                <div v-else class="text-xs text-slate-500 pl-2">
                    {{ $t('v1.view.main.dashboard.widget.select_page') }}
                </div>
            </div>
            <img src="@/assets/icons/arrow-down.svg" class="w-[15px] h-[15px]" />
        </div>
        <div v-if="is_show_select_page"
            class="absolute top-[45px] border rounded-lg py-2 mt-1 h-[300px] bg-white z-[10] w-full">
            <div class="px-2">
                <input v-model="search" type="text" class="focus:outline-none w-full h-[35px] border rounded-lg p-2"
                    :placeholder="$t('v1.common.page_search_placeholder')">
            </div>
            <div class="overflow-y-auto h-[calc(100%_-_35px)] mt-2">
                <template v-for="page of pageStore.active_page_list">
                    <div @click="selectPage(page)" v-if="filterPage(page)"
                        class="cursor-pointer flex items-center mb-2 hover:bg-orange-100">
                        <PageAvatar class="rounded-full ml-[6px] w-8 h-8"
                            :page_info="page.page" />
                        <div class="ml-2">
                            {{ page?.page?.name }}
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { usePageStore } from '@/stores'
import { nonAccentVn } from '@/service/helper/format'

import PageAvatar from '@/components/Avatar/PageAvatar.vue'

import type { PageData } from '@/service/interface/app/page'

const $emit = defineEmits(['update_select_page'])

const $props = withDefaults(defineProps<{
    /**giá trị widget đang chọn */
    selected_page?: PageData
}>(), {})

const pageStore = usePageStore()

/**có hiện chọn trang không */
const is_show_select_page = ref(false)
/**tìm kiếm trang */
const search = ref('')

/**lọc trang theo tìm kiếm */
function filterPage(page: PageData) {
    // nếu không có giá trị tìm kiếm thì luôn hiển thị
    if (!search.value) return true

    /**giá trị tìm kiếm đã được xử lý */
    const SEARCH = nonAccentVn(search.value)

    return (
        page?.page?.fb_page_id?.includes(SEARCH) ||
        nonAccentVn(page?.page?.name || '')?.includes(SEARCH)
    )
}
/**chọn trang */
function selectPage(page: PageData) {
    $emit('update_select_page', page)

    is_show_select_page.value = false
}
</script>