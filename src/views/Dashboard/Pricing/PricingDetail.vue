<template>
    <Modal ref="pricing_detail_ref">
        <template v-slot:header>
            <div class="flex items-center">
                {{ $t('v1.view.main.dashboard.pricing.detail.title') }}
                <span @click="reloadThisPricing()" class="ml-2 cursor-pointer">
                    <img src="@/assets/icons/reload.svg" width="17" height="17">
                </span>
            </div>
        </template>
        <template v-slot:body>
            <div v-if="is_loading" class="absolute left-[50%] translate-x-[-50%]">
                <Loading class="mx-auto" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 text-sm">
                <div class="grid grid-cols-3 mb-1">
                    <div class="text-slate-500">
                        {{ $t('v1.view.main.dashboard.pricing.detail.invoice_id') }}
                    </div>
                    <div class="col-span-2 font-medium">
                        {{ pricing?.invoice_id }}
                    </div>
                </div>
                <div v-if="pricing?.createdAt" class="grid grid-cols-3 mb-1">
                    <div class="text-slate-500">{{
                        $t('v1.view.main.dashboard.pricing.detail.created_at') }}</div>
                    <div class="col-span-2">
                        {{ format_date(new Date(pricing?.createdAt), 'HH:mm:ss dd/MM/yyyy') }}
                    </div>
                </div>
                <div class="grid grid-cols-3 mb-1">
                    <div class="text-slate-500">{{ $t('v1.view.main.dashboard.pricing.detail.payment')
                    }}</div>
                    <div class="col-span-2 font-bold text-red-500">
                        {{ currency(pricing?.package.payment) }}
                        {{ pricing?.package.currency }}
                    </div>
                </div>
            </div>
            <hr class="mb-1" />
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 text-sm">
                <div class="grid grid-cols-3 mb-1">
                    <div class="text-slate-500">{{
                        $t('v1.view.main.dashboard.pricing.detail.payment_method') }}</div>
                    <div class="col-span-2">
                        {{
                            $t(`v1.view.main.dashboard.pricing.detail.payment_method_detail.${pricing?.payment_method.toLowerCase()}`)
                        }}
                    </div>
                </div>
                <div class="grid grid-cols-3 mb-1">
                    <div class="text-slate-500">{{
                        $t('v1.view.main.dashboard.pricing.detail.selected_month') }}</div>
                    <div class="col-span-2 font-bold text-blue-500">
                        {{ pricing?.package.selected_month }}
                    </div>
                </div>
                <div class="grid grid-cols-3 mb-1">
                    <div class="text-slate-500">{{
                        $t('v1.view.main.dashboard.pricing.detail.selected_page') }}</div>
                    <div class="col-span-2 font-bold text-blue-500">
                        {{ pricing?.package.selected_page === 'UNLIMITED' ?
                            $t('v1.view.main.dashboard.pricing.detail.unlimited') :
                            pricing?.package.selected_page }}
                    </div>
                </div>
                <div class="grid grid-cols-3 mb-1">
                    <div class="text-slate-500">{{
                        $t('v1.view.main.dashboard.pricing.detail.selected_staff') }}</div>
                    <div class="col-span-2 font-bold text-blue-500">
                        {{ pricing?.package.selected_staff === 'UNLIMITED' ?
                            $t('v1.view.main.dashboard.pricing.detail.unlimited') :
                            pricing?.package.selected_staff }}
                    </div>
                </div>
                <div v-if="pricing?.package.cost_staff" class="grid grid-cols-3 mb-1">
                    <div class="text-slate-500">{{
                        $t('v1.view.main.dashboard.pricing.detail.cost_staff') }}</div>
                    <div class="col-span-2">
                        {{ currency(pricing?.package.cost_staff) }}
                        {{ pricing?.package.currency }}
                    </div>
                </div>
                <div v-if="pricing?.package.discount" class="grid grid-cols-3 mb-1">
                    <div class="text-slate-500">{{ $t('v1.view.main.dashboard.pricing.detail.discount')
                    }}</div>
                    <div class="col-span-2 font-bold text-green-500">
                        {{ currency(pricing?.package.discount) }}
                        {{ pricing?.package.currency }}
                    </div>
                </div>
                <div class="grid grid-cols-3 mb-1">
                    <div class="text-slate-500">{{ $t('v1.view.main.dashboard.pricing.detail.price')
                    }}</div>
                    <div class="col-span-2">
                        {{ currency(pricing?.package.price) }}
                        {{ pricing?.package.currency }}
                    </div>
                </div>
                <div class="grid grid-cols-3 mb-1">
                    <div class="text-slate-500">{{ $t('v1.common.status')
                    }}</div>
                    <div class="col-span-2 font-bold">
                        <span v-if="pricing?.pricing_status === 'ACTIVED'" class="text-green-600">
                            {{ $t('v1.view.main.dashboard.pricing.type_info.actived') }}
                        </span>
                        <span v-if="pricing?.pricing_status === 'CREATED'" class="text-blue-600">
                            {{ $t('v1.view.main.dashboard.pricing.type_info.created') }}
                        </span>
                        <span v-if="pricing?.pricing_status === 'EXPIRED'" class="text-violet-500">
                            {{ $t('v1.view.main.dashboard.pricing.type_info.expired') }}
                        </span>
                        <span v-if="pricing?.pricing_status === 'CANCELLED'" class="text-red-500">
                            {{ $t('v1.view.main.dashboard.pricing.type_info.cancelled') }}
                        </span>
                    </div>
                </div>
            </div>
        </template>
    </Modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { format as format_date } from 'date-fns'
import { currency } from '@/service/helper/format'

import Modal from '@/components/Modal.vue'
import Loading from '@/components/Loading.vue'

import type { PricingInfo } from '@/service/interface/app/pricing'
import { flow } from '@/service/helper/async'
import type { CbError } from '@/service/interface/function'
import { read_me_pricing } from '@/service/api/chatbox/n4-service'
import type { ComponentRef } from '@/service/interface/vue'

const $emit = defineEmits(['update_this_pricing'])

const $props = withDefaults(defineProps<{
    /**v-model được truyền vào */
    pricing?: PricingInfo
}>(), {})

/**ref của modal */
const pricing_detail_ref = ref<ComponentRef>()
/**gắn cờ loading  */
const is_loading = ref(false)

/**mở modal của pricing detail */
function openPricingDetailModal() {
    pricing_detail_ref.value.toggleModal()
}
/**load lại dữ liệu gói */
function reloadThisPricing() {
    flow([
        // * kích hoạt loading
        (cb: CbError) => {
            is_loading.value = true

            cb()
        },
        // * call api đọc gói
        (cb: CbError) => read_me_pricing({
            pricing_id: $props.pricing?._id
        }, (e, r) => {
            if (e) return cb(e)

            $emit('update_this_pricing', r) 
            cb()
        }),
    ], e => {
        // tắt loading
        is_loading.value = false
    })
}

defineExpose({ openPricingDetailModal })
</script>