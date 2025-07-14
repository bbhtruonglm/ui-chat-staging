<template>
    <div class="w-full h-full bg-slate-100 md:bg-white">
        <div class="bg-white pt-[65px] md:pt-8 xl:pt-4">
            <div class="pl-14 pr-4 md:pl-4 h-[35px] flex items-center justify-end">
                <span class="text-slate-400">{{ $t('v1.view.main.dashboard.pricing.help.you_need_help') }}</span>
                <a href="https://m.me/1706801539392655" target="_blank"
                    class="hover:underline cursor-pointer text-orange-600 ml-1">{{
                        $t('v1.view.main.dashboard.pricing.help.connect_us') }}</a>

                <span @click="getAllPricing()" class="ml-4 cursor-pointer">
                    <img src="@/assets/icons/reload.svg" width="20" height="20">
                </span>
            </div>
            <PlatformTab v-model="current_selected_tab" :platform_list="list_tab_select" />
        </div>
        <div class="px-2 pt-2 relative h-[calc(100%_-_229px)] md:h-[calc(100%_-_169px)]">
            <div v-if="is_loading_pricing_list" class="absolute left-[50%] translate-x-[-50%]">
                <Loading class="mx-auto" />
            </div>
            <div v-if="!filter_pricing_list || !filter_pricing_list.length"
                class="h-[calc(100%_-_36px)] md:h-full flex justify-center pt-10">
                <div>
                    <img src="@/assets/icons/empty-page.svg" class="mx-auto w-[200px]">
                    <div class="text-center text-slate-500">
                        {{ $t('v1.view.main.dashboard.pricing.empty_pricing') }}
                    </div>
                </div>
            </div>
            <div :class="{ 'md:grid-cols-3 xl:grid-cols-4': commonStore.dashboard_toggle_nav }"
                class="max-h-full overflow-y-auto grid grid-cols-1 pb-5 md:max-h-full md:grid-cols-2 gap-2 md:gap-4 xl:grid-cols-3">
                <div v-for="pricing of filter_pricing_list"
                    class="bg-white rounded-md border-b-2 hover:border-orange-500 md:bg-slate-100 p-2 ">
                    <div class="flex justify-between">
                        <div class="flex">
                            <img src="@/assets/icons/pricing.svg" width="17" height="17">
                            <div class="ml-1">{{ pricing.invoice_id }}</div>
                        </div>
                        <div class="text-right">
                            <span v-if="pricing.pricing_status === 'ACTIVED'" class="text-green-600">
                                {{ $t('v1.view.main.dashboard.pricing.type_info.actived') }}
                            </span>
                            <span v-if="pricing.pricing_status === 'CREATED'" class="text-blue-600">
                                {{ $t('v1.view.main.dashboard.pricing.type_info.created') }}
                            </span>
                            <span v-if="pricing.pricing_status === 'EXPIRED'" class="text-violet-500">
                                {{ $t('v1.view.main.dashboard.pricing.type_info.expired') }}
                            </span>
                            <span v-if="pricing.pricing_status === 'CANCELLED'" class="text-red-500">
                                {{ $t('v1.view.main.dashboard.pricing.type_info.cancelled') }}
                            </span>
                        </div>
                    </div>
                    <div class="mt-2 flex justify-between text-xs">
                        <div class="flex items-center">
                            <img src="@/assets/icons/page-white.svg" width="17" height="17">
                            <div class="ml-1 text-slate-400">
                                {{ pricing.list_pages.length }}
                                /
                                {{ pricing.package.selected_page !== 'UNLIMITED' ? pricing.package.selected_page : '∞' }}
                            </div>
                        </div>
                        <div class="flex items-center">
                            <img src="@/assets/icons/user-list.svg" width="17" height="17">
                            <div class="ml-1 text-slate-400">
                                {{ pricing.list_staffs.length }}
                                /
                                {{ pricing.package.selected_staff !== 'UNLIMITED' ? pricing.package.selected_staff : '∞' }}
                            </div>
                        </div>
                        <div class="flex items-center">
                            <img src="@/assets/icons/money.svg" width="17" height="17">
                            <div class="ml-1 text-slate-400">
                                {{ currency(pricing.package.payment) }}
                            </div>
                        </div>
                        <div class="flex items-center">
                            <img src="@/assets/icons/expired.svg" width="17" height="17">
                            <div class="ml-1 text-slate-400">
                                <span v-if="pricing.end_date">
                                    {{ format_date(new Date(pricing.end_date), 'dd/MM/yy') }}
                                </span>
                                <span v-else>- -/- -/- -</span>
                            </div>
                        </div>
                    </div>
                    <div class="mt-1 flex justify-between items-end">
                        <div @click="openPricingDetailModal(pricing)"
                            class="text-xs text-orange-500 font-medium cursor-pointer">
                            {{ $t('v1.view.main.dashboard.pricing.pricing_detail') }}
                        </div>
                        <div>
                            <button v-if="pricing.pricing_status === 'CREATED'" @click="cancelThisPricing(pricing._id)"
                                class="text-xs px-2 py-[3px] rounded ml-2 bg-gray-400 hover:bg-gray-500 text-white">
                                {{ $t('v1.common.cancel') }}
                            </button>
                            <button v-if="pricing.pricing_status === 'ACTIVED'" @click="openPricingUpgrade(pricing._id)"
                                class="text-xs px-2 py-[3px] rounded ml-2 text-blue-500">
                                {{ $t('v1.view.main.dashboard.pricing.action.upgrade') }}
                            </button>
                            <button v-if="pricing.pricing_status === 'EXPIRED'"
                                @click="inactiveAllPageAndStaffOfThisPricing(pricing)"
                                class="text-xs px-2 py-[3px] rounded ml-2 text-violet-500">
                                {{ $t('v1.view.main.dashboard.pricing.action.disconnect') }}
                            </button>
                            <button @click="openPricingSettingModal(pricing)"
                                v-if="pricing.pricing_status === 'ACTIVED'"
                                class="text-xs px-2 py-[3px] rounded ml-2 bg-orange-500 hover:bg-orange-600 text-white">
                                {{ $t('v1.common.setting') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <FooterButton :text="$t('v1.view.main.dashboard.pricing.create_pricing')"
            @click_btn="create_pricing_ref.openCreatePricing()" />
    </div>
    <template>
        <CreatePricing ref="create_pricing_ref" @done_create_pricing="handleDoneCreatePricing" />
        <PricingDetail @update_this_pricing="reloadPricingDetail" ref="pricing_detail_ref"
            :pricing="current_pricing_detail" />
        <UpgradePricing ref="upgrade_pricing_ref" @done_upgrade_pricing="openPricingDetailModal"
            :pricing_id="current_pricing_id_upgrade" />
        <SettingPricing @done_setting_pricing="doneSettingPricing" ref="setting_pricing_ref"
            :pricing="current_setting_pricing" />
    </template>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCommonStore } from '@/stores'
import { flow } from '@/service/helper/async'
import { cancel_this_pricing, control_active_pricing, read_me_pricing } from '@/service/api/chatbox/n4-service'
import { keyBy, map, mapValues } from 'lodash'
import { currency } from '@/service/helper/format'
import { format as format_date } from 'date-fns'
import { copy } from '@/service/helper/format'
import { confirm, toast } from '@/service/helper/alert'

import Loading from '@/components/Loading.vue'
import PlatformTab from '@/components/Main/Dashboard/PlatformTab.vue'
import PricingDetail from '@/views/Dashboard/Pricing/PricingDetail.vue'
import CreatePricing from '@/views/Dashboard/Pricing/CreatePricing.vue'
import UpgradePricing from '@/views/Dashboard/Pricing/UpgradePricing.vue'
import FooterButton from '@/components/Main/Dashboard/FooterButton.vue'
import SettingPricing from '@/views/Dashboard/Pricing/SettingPricing.vue'

import type { CbError } from '@/service/interface/function'
import type { PricingInfo } from '@/service/interface/app/pricing'
import type { TabPlatform } from '@/service/interface/app/page'
import type { ComponentRef } from '@/service/interface/vue'

const { t: $t } = useI18n()
const commonStore = useCommonStore()

/**danh sách các tab gốc */
const ROOT_TAB = {
    ALL_STATUS: {
        title: $t(`v1.common.all`),
        count: 0
    },
    ...mapValues(keyBy([
        'ACTIVED',
        'CREATED',
        'EXPIRED',
        'CANCELLED'
    ]), n => {
        return {
            title: $t(`v1.view.main.dashboard.pricing.type.${n.toLowerCase()}`),
            count: 0
        }
    })
}
/**danh sách các tab */
const list_tab_select = ref<TabPlatform>(copy(ROOT_TAB))
/**nền tảng hiện tại đang được chọn */
const current_selected_tab = ref('ALL_STATUS')
/**danh sách pricing sau khi được lọc */
const filter_pricing_list = ref<PricingInfo[]>()
/**gắn cờ loading cho danh sách pricing */
const is_loading_pricing_list = ref(false)
/**danh sách toan bộ các pricing của user */
const pricing_list = ref<{
    [index: string]: PricingInfo
}>({})
/**ref của modal tạo  mới gói */
const create_pricing_ref = ref<ComponentRef>()
/**ref của modal chi tiết 1 gois */
const pricing_detail_ref = ref<ComponentRef>()
/**dữ liệu chi tiết của 1 gói khi được chonj */
const current_pricing_detail = ref<PricingInfo>()
/**id của gói muốn nâng cấp */
const current_pricing_id_upgrade = ref<string>()
/**ref của modal nâng cấp gói */
const upgrade_pricing_ref = ref<ComponentRef>()
/**ref của modal setting pricing */
const setting_pricing_ref = ref<ComponentRef>()
/**data của pricing hiện tại đang được setting */
const current_setting_pricing = ref<PricingInfo>()

// lọc danh sách pricing khi chọn tab
watch(() => current_selected_tab.value, () => filterListPricing())
// nạp lại danh sách pricing thì có thay đổi
watch(() => pricing_list.value, () => filterListPricing())

onMounted(() => getAllPricing())

/**lọc danh sách page để hiển thị theo các điều kiện được lựa chọn */
function filterListPricing() {
    // kích hoạt loading
    is_loading_pricing_list.value = true

    // lọc theo tab
    filter_pricing_list.value = map(pricing_list.value).filter(pricing => {
        if (
            current_selected_tab.value === 'ALL_STATUS' ||
            current_selected_tab.value === pricing.pricing_status
        ) return true

        return false
    })

    // tắt loading
    is_loading_pricing_list.value = false
}
/**lấy toàn bộ các page của user này */
function getAllPricing() {
    flow([
        // * kích hoạt loading
        (cb: CbError) => {
            is_loading_pricing_list.value = true

            cb()
        },
        // * call api đọc danh sách gói
        (cb: CbError) => read_me_pricing({}, (e, r) => {
            if (e) return cb(e)

            pricing_list.value = r
            cb()
        }),
        // * tính count cho từng trạng thái
        (cb: CbError) => {
            cb()

            // reset count
            list_tab_select.value = copy(ROOT_TAB)

            map(pricing_list.value, (pricing => {
                const PRICING_STATUS = pricing.pricing_status

                if (!PRICING_STATUS) return

                // count all
                list_tab_select.value.ALL_STATUS.count++
                // count cho từng page type
                list_tab_select.value[PRICING_STATUS].count++
            }))
        }
    ], e => {
        // tắt loading
        is_loading_pricing_list.value = false
    })
}
/**xử lý sự kiện sau khi tạo mới gói */
function handleDoneCreatePricing(pricing?: PricingInfo) {
    if (!pricing) return

    // quay về tab all
    current_selected_tab.value = 'ALL_STATUS'

    // thêm gói mới vào list data
    updateThisPricing(pricing)

    // cộng thêm count
    list_tab_select.value.ALL_STATUS.count++
    list_tab_select.value.CREATED.count++

    // hiện pricing detail
    openPricingDetailModal(pricing)
}
/**cập nhật lại dữ liệu của gói */
function updateThisPricing(pricing?: PricingInfo) {
    if (!pricing) return

    pricing_list.value[pricing?._id] = pricing

    pricing_list.value = copy(pricing_list.value)
}
/**mở modal nâng cấp gói */
function openPricingUpgrade(pricing_id: string) {
    current_pricing_id_upgrade.value = pricing_id

    upgrade_pricing_ref.value.openUpgradePricing()
}
/**mở modal pricing detail */
function openPricingDetailModal(pricing: PricingInfo) {
    current_pricing_detail.value = pricing

    pricing_detail_ref.value.openPricingDetailModal()
}
/**load lại chi tiết gói */
function reloadPricingDetail(pricing?: PricingInfo) {
    if (!pricing) return

    updateThisPricing(pricing)

    current_pricing_detail.value = pricing
}
/**huỷ một gói chưa thanh toán */
function cancelThisPricing(pricing_id: string) {
    flow([
        // * hỏi người dùng có chắc chắn muốn huỷ không
        (cb: CbError) => confirm(
            'question',
            $t('v1.view.main.dashboard.pricing.cancel.title'),
            '',
            (e, r) => {
                if (e) return

                cb()
            }
        ),
        // * kích hoạt loading
        (cb: CbError) => {
            is_loading_pricing_list.value = true

            cb()
        },
        (cb: CbError) => cancel_this_pricing(pricing_id, (e, r) => {
            if (e) return cb(e)

            updateThisPricing(r)
            cb()
        }),
    ], e => {
        // tắt loading
        is_loading_pricing_list.value = false
    })
}
/**mở modal setting */
function openPricingSettingModal(pricing: PricingInfo) {
    // set data
    current_setting_pricing.value = pricing

    // mở modal
    setting_pricing_ref.value.openSettingPricingModal()
}
/**cập nhật lại dữ liệu gói sau các hành động setting */
function doneSettingPricing(pricing?: PricingInfo) {
    // sửa lại data pricing đang chọn
    current_setting_pricing.value = pricing

    // sửa lại data trong list
    updateThisPricing(pricing)
}
/**ngắt kết nối toàn bộ page và staff của gói này */
function inactiveAllPageAndStaffOfThisPricing(pricing: PricingInfo) {
    const DATA: {
        pricing?: PricingInfo
    } = {}

    // * xác nhận lại trước khi ngắt kết nối
    confirm(
        'question',
        $t('v1.view.main.dashboard.pricing.disconnect.title'),
        '',
        (e, r) => {
            if (e) return

            flow([
                // * ngắt kết nối toàn bộ
                (cb: CbError) => control_active_pricing({
                    pricing_id: pricing._id,
                    inactive_page_id_list: pricing.list_pages,
                    inactive_staff_id_list: pricing.list_staffs
                }, (e, r) => {
                    if (e) return cb(e)

                    DATA.pricing = r
                    cb()
                }),
                // load lại dữ liệu page và staff mới
                (cb: CbError) => setting_pricing_ref
                    .value
                    .getAllPageAndStaffInfo((e: any, r: any) => {
                        if (e) return cb(e)

                        cb()
                    }),
                // * xử lý sau khi thành công
                (cb: CbError) => {
                    // cập nhật lại pricing
                    doneSettingPricing(DATA.pricing)

                    // alert success
                    toast('success', $t('v1.common.success'))

                    cb()
                },
            ], undefined, true)
        })
}

// public chức năng 
defineExpose({ getAllPricing })
</script>