<template>
    <div class="border w-full px-3 py-2 rounded-lg flex items-center justify-between cursor-pointer" @click="toggle">
        <p v-if="!page_selected?.page?.name">
            {{ $t('v1.view.main.dashboard.chat.filter.label.all_page') }}
        </p>
        <p v-if="page_selected?.page?.name" class="w-[90%] truncate">{{ page_selected.page.name }}</p>
        <img :src="DownIcon" class="w-3" alt="">
    </div>
    <Dropdown ref="filter_dropdown_ref" position="BOTTOM" height="fit-content">
        <div 
            @click="selectPage()"
            class="cursor-pointer flex items-center mb-1 hover:bg-orange-100 rounded-lg p-1"
        >
            <p class="text-[14px] ml-1 w-[90%] truncate">
                {{ $t('v1.view.main.dashboard.chat.filter.label.all_page') }}
            </p>
        </div>
        <div 
            v-for="page_info, page_id in pages" 
            @click="selectPage(page_info, page_id as string)"
            class="cursor-pointer flex items-center mb-1 hover:bg-orange-100 rounded-lg p-1"
        >
            <PageAvatar
                :page_info="page_info.page"
                class="rounded-full border-2 border-white w-8 h-8"
            />
            <p class="text-[14px] ml-1 w-[90%] truncate">{{ page_info.page?.name }}</p>
        </div>
    </Dropdown>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { usePageStore } from '@/stores'

// * Components
import Dropdown from '@/components/Dropdown.vue'
import PageAvatar from '@/components/Avatar/PageAvatar.vue'

// * Icon
import DownIcon from '@/assets/icons/arrow-down.svg'

// * Interface
import type { ComponentRef } from '@/service/interface/vue'
import type { PageList, PageData } from '@/service/interface/app/page'

const $props = withDefaults(defineProps<{
    select_page: Function
}>(), {})

// * Use Store
const pageStore = usePageStore()

/** Id page đã chọn */
const page_selected = ref<PageData>()
/** Danh sách page đã chọn */
const pages = ref<PageList>(pageStore.selected_page_list_info)
/**ref của dropdown */
const filter_dropdown_ref = ref<ComponentRef>()

/** Ẩn hiện dropdown */
function toggle($event: MouseEvent) {
    filter_dropdown_ref.value?.toggleDropdown($event)
}
/** Chọn page */
function selectPage(page?: PageData, page_id?: string) {
    // Trường hợp chọn tất cả page
    if(!page) {
        page_selected.value = undefined
        $props.select_page('')
    }

    // Trường hợp chọn 1 page
    page_selected.value = page
    $props.select_page(page_id)
    filter_dropdown_ref.value?.toggleDropdown()
}

</script>