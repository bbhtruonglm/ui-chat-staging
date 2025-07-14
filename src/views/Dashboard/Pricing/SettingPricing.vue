<template>
    <Modal @close_modal="onCloseModal" ref="setting_pricing_ref">
        <template v-slot:header>
            <div class="md:flex">
                <div class="mr-4">
                    {{ $t('v1.view.main.dashboard.pricing.setting.title') }}:
                    {{ pricing?.invoice_id }}
                </div>
                <div class="font-light flex">
                    <div class="flex items-center">
                        <img src="@/assets/icons/page-white.svg" width="17" height="17">
                        <div class="ml-1 text-slate-400">
                            {{ pricing?.list_pages.length }}
                            /
                            {{ pricing?.package.selected_page !== 'UNLIMITED' ? pricing?.package.selected_page : '∞' }}
                        </div>
                    </div>
                    <div class="flex items-center ml-4">
                        <img src="@/assets/icons/user-list.svg" width="17" height="17">
                        <div class="ml-1 text-slate-400">
                            {{ pricing?.list_staffs.length }}
                            /
                            {{ pricing?.package.selected_staff !== 'UNLIMITED' ? pricing?.package.selected_staff : '∞' }}
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-slot:body>
            <div class="grid grid-cols-2 gap-4">
                <div @click="current_select_tab = 'PAGE'"
                    :class="current_select_tab === 'PAGE' ? 'border-b-2 border-orange-500' : 'text-slate-500'"
                    class="cursor-pointer text-center font-bold">
                    {{ $t('v1.common.active') }} {{ $t('v1.common.page') }}
                </div>
                <div @click="current_select_tab = 'STAFF'"
                    :class="current_select_tab === 'STAFF' ? 'border-b-2 border-orange-500' : 'text-slate-500'"
                    class="cursor-pointer text-center font-bold ">
                    {{ $t('v1.common.active') }} {{ $t('v1.common.staff') }}
                </div>
            </div>
            <Search v-model="search" class="mt-2" :placeholder="$t('v1.common.search')" />
            <div v-if="is_loading" class="absolute left-[50%] translate-x-[-50%]">
                <Loading class="mx-auto" />
            </div>
            <div
                class="max-h-[calc(100vh_-_339px)] overflow-y-auto mt-1 grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-4 md:pt-2 md:gap-3">
                <template v-if="current_select_tab === 'PAGE'">
                    <PricingActiveItem @click="toggleItem(page_data, page_data.page?.pricing_id)"
                        v-for="page_data of filter_page_list" :page_data="page_data" :pricing_id="pricing?._id" />
                </template>
                <template v-if="current_select_tab === 'STAFF'">
                    <PricingActiveItem @click="toggleItem(staff_data, staff_data.pricing_id)"
                        v-for="staff_data of filter_staff_list" :staff_data="staff_data" :pricing_id="pricing?._id" />
                </template>
            </div>
            <div v-if="current_select_tab === 'PAGE' && !size(filter_page_list)">
                <img src="@/assets/icons/empty-page.svg" class="mx-auto w-[200px]">
                <div class="text-slate-500 text-center text-sm">
                    {{ $t('v1.view.main.dashboard.pricing.setting.page_not_found') }}
                </div>
            </div>
            <div v-if="current_select_tab === 'STAFF' && !size(filter_staff_list)">
                <img src="@/assets/icons/empty-page.svg" class="mx-auto w-[200px]">
                <div class="text-slate-500 text-center text-sm">
                    {{ $t('v1.view.main.dashboard.pricing.setting.staff_not_found') }}
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <div class="grid grid-cols-2">
                <div @click="selectAll" class="text-sm text-orange-500 cursor-pointer flex items-center">
                    {{ $t('v1.common.select_all') }}
                    <input
                        :checked="(current_select_tab === 'PAGE' && !isNotSelectAllItem(page_list)) || (current_select_tab === 'STAFF' && !isNotSelectAllItem(staff_list))"
                        type="checkbox" class="w-[15px] h-[15px] accent-orange-600 ml-1">
                </div>
                <div class="text-right">
                    <button @click="activeSelectData"
                        class="text-white bg-orange-500 rounded-full px-4 text-sm font-semibold py-1">
                        {{ $t('v1.common.active') }}
                    </button>
                </div>
            </div>
        </template>
    </Modal>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import {
    get_current_active_page, read_pricing_info_of_list_chatbot_user,
    control_active_pricing, read_me_chatbot_user
} from '@/service/api/chatbox/n4-service'
import { flow } from '@/service/helper/async'
import { debounce, map, size } from 'lodash'
import { nonAccentVn } from '@/service/helper/format'
import { usePageStore, useStaffStore, useChatbotUserStore } from '@/stores'

import Modal from '@/components/Modal.vue'
import Search from '@/components/Main/Dashboard/Search.vue'
import Loading from '@/components/Loading.vue'
import PricingActiveItem from '@/components/Main/Dashboard/PricingActiveItem.vue'

import type { SelectStaffData } from '@/service/interface/app/staff'
import type { SelectPageData } from '@/service/interface/app/page'
import type { PricingInfo } from '@/service/interface/app/pricing'
import type { Cb, CbError } from '@/service/interface/function'
import type { ChatbotUserInfo } from '@/service/interface/app/chatbot_user'
import { toast } from '@/service/helper/alert'
import { useI18n } from 'vue-i18n'
import type { ComponentRef } from '@/service/interface/vue'

interface PageList {
    [index: string]: SelectPageData
}
interface StaffList {
    [index: string]: SelectStaffData
}

const $emit = defineEmits(['done_setting_pricing'])
const pageStore = usePageStore()
const staffStore = useStaffStore()
const chatbotUserStore = useChatbotUserStore()

const $props = withDefaults(defineProps<{
    /**v-model được truyền vào */
    pricing?: PricingInfo
}>(), {})
const { t: $t } = useI18n()

/**tab hiện tại đang được chọn */
const current_select_tab = ref<'PAGE' | 'STAFF'>('PAGE')
/**ref của modal setting pricing */
const setting_pricing_ref = ref<ComponentRef>()
/**có loading hay không */
const is_loading = ref(false)
/**danh sách page của user */
const page_list = ref<PageList>()
/**danh sách nhân viên của user */
const staff_list = ref<StaffList>()
/**danh sách page đã được lọc */
const filter_page_list = ref<SelectPageData[]>()
/**danh sách nhân viên đã được lọc */
const filter_staff_list = ref<SelectStaffData[]>()
/**tìm kiếm */
const search = ref('')
/**dữ liệu chi tiết của từng chatbot user */
const list_chatbot_user_info = ref<{
    [index: string]: ChatbotUserInfo
}>({})

/**lọc dữ liệu hiển thị khi tìm kiếm */
watch(() => search.value, () => {
    // kích hoạt loading
    is_loading.value = true

    // sau xx time mới search
    delaySearch()
})
/**lọc dữ liệu hiển thị khi load page */
watch(() => page_list.value, (val) => filterData())
/**lọc dữ liệu hiển thị khi load staff */
watch(() => staff_list.value, () => filterData())
/**lọc dữ liệu hiển thị khi đổi tab */
watch(() => current_select_tab.value, () => filterData())

onMounted(() => getAllPageAndStaffInfo())

/**sau xx thời gian mới search */
const delaySearch = debounce(() => filterData(), 300)
/**xử lý dữ liệu hiển thị */
function filterData() {
    // format search
    const SEARCH_VALUE = nonAccentVn(search.value)

    // chỉ chạy khi ở tab page
    if (current_select_tab.value === 'PAGE') {
        // object -> array
        filter_page_list.value = map(page_list.value)

        // search theo tên và id
        filter_page_list.value = filter_page_list.value.filter(page => {
            const page_id = page.page?.fb_page_id || ''
            const page_name = nonAccentVn(page.page?.name || '')

            if (
                page_id.includes(SEARCH_VALUE) ||
                page_name.includes(SEARCH_VALUE)
            ) return true
        })
    }

    // chỉ chạy khi ở tab staff
    if (current_select_tab.value === 'STAFF') {
        // object -> array
        filter_staff_list.value = map(staff_list.value)

        // search theo tên và id
        filter_staff_list.value = filter_staff_list.value.filter(staff => {
            const staff_id = staff.fb_staff_id
            const staff_name = nonAccentVn(staff.name)

            if (
                staff_id.includes(SEARCH_VALUE) ||
                staff_name.includes(SEARCH_VALUE)
            ) return true
        })
    }

    // tắt loading
    is_loading.value = false
}
/**đọc toàn bộ dữ liệu page và staff */
function getAllPageAndStaffInfo(proceed?: Cb) {
    flow([
        // * kích hoạt loading
        (cb: CbError) => {
            is_loading.value = true

            cb()
        },
        // * call api đọc danh sách page
        (cb: CbError) => get_current_active_page({}, (e, r) => {
            if (e) return cb(e)

            page_list.value = r.page_list
            staff_list.value = r.all_staff_list
            cb()
        }),
        // * call api đọc info của từng staff
        (cb: CbError) => read_pricing_info_of_list_chatbot_user(
            map(staff_list.value, staff_data => staff_data.fb_staff_id),
            (e, r) => {
                if (e) return cb(e)
                if (!r) return cb()

                list_chatbot_user_info.value = r

                // gán id gói cho user nếu có
                map(staff_list.value, staff_data => {
                    staff_data.pricing_id =
                        list_chatbot_user_info.value?.[staff_data?.fb_staff_id]?.pricing_id
                })

                cb()
            }
        )
    ], e => {
        // tắt loading
        is_loading.value = false

        if (proceed) proceed()
    })
}
/**clear checked khi tắt modal */
function onCloseModal() {
    // clear page
    map(page_list.value, page_data => {
        page_data.is_select = false
    })

    // clear staff
    map(staff_list.value, staff_data => {
        staff_data.is_select = false
    })
}
/**tự động select page và staff thoả mãn */
function doCheckValidData() {
    // tự động check các page có id gói (đã được kích hoạt)
    map(page_list.value, page_data => {
        if (page_data.page?.pricing_id) page_data.is_select = true
    })

    // * tìm và check các staff có id gói (đã được kích hoạt)
    map(staff_list.value, staff_data => {
        if (staff_data.pricing_id) staff_data.is_select = true
    })
}
/**mở modal của pricing detail */
function openSettingPricingModal() {
    doCheckValidData()

    // toggle modal
    setting_pricing_ref.value.toggleModal()
}
/**kích hoạt | huỷ kích hoạt page, staff */
function toggleItem(
    target_data: SelectPageData | SelectStaffData,
    this_pricing_id?: string
) {
    // không xử lý các hành động với item được kích hoạt ở gói khác
    if (this_pricing_id && this_pricing_id !== $props.pricing?._id) return

    // toggle
    target_data.is_select = !target_data.is_select
}
/**kiểm tra xem có chọn toàn bộ item hay không */
function isNotSelectAllItem(item_list?: PageList | StaffList) {
    const FILTER_SELECT_ITEM = map(item_list as PageList ).filter(item => item.is_select)

    return size(item_list) > size(FILTER_SELECT_ITEM)
}
/**chọn tất cả */
function selectAll() {
    // nếu đang ở tab page
    if (current_select_tab.value === 'PAGE') {
        // chọn tất cả page nếu chưa chọn hết
        if (isNotSelectAllItem(page_list.value)) map(page_list.value, page_data => {
            page_data.is_select = true
        })
        // nếu chọn hết thì huỷ chọn
        else map(page_list.value, page_data => {
            page_data.is_select = false
        })
    }
    // nếu đang ở tab staff
    if (current_select_tab.value === 'STAFF') {
        // chọn tất cả staff nếu chưa chọn hết
        if (isNotSelectAllItem(staff_list.value)) map(staff_list.value, staff_data => {
            staff_data.is_select = true
        })
        // nếu chọn hết thì huỷ chọn
        else map(staff_list.value, staff_data => {
            staff_data.is_select = false
        })
    }
}
/**kích hoạt dữ liệu page và nhân viên */
function activeSelectData() {
    const LIST_ADD_PAGE_ID: string[] = []
    const LIST_REMOVE_PAGE_ID: string[] = []
    const LIST_ADD_STAFF_ID: string[] = []
    const LIST_REMOVE_STAFF_ID: string[] = []

    const DATA: {
        pricing?: PricingInfo
    } = {}
    flow([
        // * xử lý dữ liệu page
        (cb: CbError) => {
            map(page_list.value, page => {
                if (!page.page?.fb_page_id) return

                // check các page mới được thêm
                if (!page.page?.pricing_id && page.is_select)
                    LIST_ADD_PAGE_ID.push(page.page?.fb_page_id)

                // check các page cũ bị xoá
                if (page.page?.pricing_id === $props.pricing?._id && !page.is_select)
                    LIST_REMOVE_PAGE_ID.push(page.page?.fb_page_id)
            })

            cb()
        },
        // * xử lý dữ liệu staff
        (cb: CbError) => {
            map(staff_list.value, staff => {
                if (!staff.fb_staff_id) return

                // check các staff mới được thêm
                if (!staff.pricing_id && staff.is_select)
                    LIST_ADD_STAFF_ID.push(staff.fb_staff_id)

                // check các staff cũ bị xoá
                if (staff.pricing_id === $props.pricing?._id && !staff.is_select)
                    LIST_REMOVE_STAFF_ID.push(staff.fb_staff_id)
            })

            cb()
        },
        // * call api
        (cb: CbError) => control_active_pricing({
            pricing_id: $props.pricing?._id,
            active_page_id_list: LIST_ADD_PAGE_ID,
            inactive_page_id_list: LIST_REMOVE_PAGE_ID,
            active_staff_id_list: LIST_ADD_STAFF_ID,
            inactive_staff_id_list: LIST_REMOVE_STAFF_ID,
        }, (e, r) => {
            if (e) return cb(e)

            DATA.pricing = r
            cb()
        }),
        // load lại dữ liệu page và staff mới
        (cb: CbError) => getAllPageAndStaffInfo((e, r) => {
            if (e) return cb(e)

            cb()
        }),
        // * nạp lại trạng thái của các page hiện tại
        (cb: CbError) => get_current_active_page({ is_active: true }, (e, r) => {
            if (e) return cb(e)

            pageStore.active_page_list = r.page_list
            staffStore.staff_list_of_active_page = r.all_staff_list
            cb()
        }),
        // * nạp lại trạng thái của người dùng
        (cb: CbError) => read_me_chatbot_user((e, r) => {
            if (e) return cb(e)

            // lưu vào store
            chatbotUserStore.chatbot_user = r
            cb()
        }),
        // * xử lý sau khi thành công
        (cb: CbError) => {
            // check lại dữ liệu
            doCheckValidData()

            // alert success
            toast('success', $t('v1.common.success'))

            // reload data pricing
            $emit('done_setting_pricing', DATA.pricing)

            cb()
        },
    ], undefined, true)
}

defineExpose({ openSettingPricingModal, getAllPageAndStaffInfo })
</script>