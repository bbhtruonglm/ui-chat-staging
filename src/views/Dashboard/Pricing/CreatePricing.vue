<template>
    <Modal ref="create_pricing_ref">
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.pricing.create_pricing') }}
        </template>
        <template v-slot:body>
            <div :class="create_pricing_data.code === 'CUSTOM' ? 'md:grid-cols-2 xl:grid-cols-3' : ''"
                class="grid grid-cols-1  gap-x-2">
                <div :class="create_pricing_data.code === 'CUSTOM' ? '' : 'md:grid-cols-4'"
                    class="grid grid-cols-3 mb-2 gap-x-2">
                    <div class="text-slate-500 md:text-right">
                        {{ $t('v1.view.main.dashboard.pricing.create.package') }}
                    </div>
                    <Select class="col-span-2 md:col-span-2" v-model="create_pricing_data.code"
                        :placeholder="$t('v1.view.main.dashboard.pricing.create.package_description')">
                        <Option v-for="code of CODE_LIST" :value="code">
                            {{ $t(`v1.view.main.dashboard.pricing.create.code.${code}`) }}
                        </Option>
                    </Select>
                </div>
                <template v-if="create_pricing_data.code === 'CUSTOM'">
                    <div class="grid grid-cols-3 mb-2 gap-x-2">
                        <div class="text-slate-500 md:text-right">
                            {{ $t('v1.view.main.dashboard.pricing.create.page') }}
                        </div>
                        <Select class="col-span-2" v-model="create_pricing_data.selected_page"
                            :placeholder="$t('v1.view.main.dashboard.pricing.create.page_description')">
                            <Option v-for="i of 30" :value="i">
                                {{ i }} {{ $t('v1.common.page') }}
                            </Option>
                        </Select>
                    </div>
                    <div class="grid grid-cols-3 mb-2 gap-x-2">
                        <div class="text-slate-500 md:text-right">
                            {{ $t('v1.view.main.dashboard.pricing.create.month') }}
                        </div>
                        <Select class="col-span-2" v-model="create_pricing_data.selected_month"
                            :placeholder="$t('v1.view.main.dashboard.pricing.create.month_description')">
                            <Option value="6">
                                6 {{ $t('v1.common.month') }}
                            </Option>
                            <Option value="12">
                                12 {{ $t('v1.common.month') }}
                            </Option>
                            <Option value="24">
                                24 {{ $t('v1.common.month') }}
                            </Option>
                        </Select>
                    </div>
                    <div class="grid grid-cols-3 mb-2 gap-x-2">
                        <div class="text-slate-500 md:text-right">
                            {{ $t('v1.view.main.dashboard.pricing.create.staff') }}
                        </div>
                        <Select class="col-span-2" v-model="create_pricing_data.selected_staff"
                            :placeholder="$t('v1.view.main.dashboard.pricing.create.staff_description')">
                            <Option v-for="i of 60" :value="i">
                                {{ i }} {{ $t('v1.common.staff') }}
                            </Option>
                        </Select>
                    </div>
                </template>
            </div>
            <hr class="mb-2" />
            <div v-if="is_loading_calc_price" class="absolute left-[50%] translate-x-[-50%]">
                <Loading class="mx-auto" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-2">
                <div v-if="price_of_pricing.price && price_of_pricing.discount" class="grid grid-cols-3 mb-2 gap-x-2">
                    <div class="text-slate-500 md:text-right">
                        {{ $t('v1.view.main.dashboard.pricing.detail.price') }}
                    </div>
                    <div class="font-bold col-span-2">
                        {{ currency(price_of_pricing.price) }}
                        {{ CURRENCY }}
                    </div>
                </div>
                <div v-if="price_of_pricing.cost_staff" class="grid grid-cols-3 mb-2 gap-x-2">
                    <div class="text-slate-500 md:text-right">
                        {{ $t('v1.view.main.dashboard.pricing.detail.cost_staff') }}
                    </div>
                    <div class="col-span-2">
                        {{ currency(price_of_pricing.cost_staff) }}
                        {{ CURRENCY }}
                    </div>
                </div>
                <div v-if="price_of_pricing.discount" class="grid grid-cols-3 mb-2 gap-x-2">
                    <div class="text-slate-500 md:text-right">
                        {{ $t('v1.view.main.dashboard.pricing.detail.discount') }}
                    </div>
                    <div class="font-bold text-green-500 col-span-2">
                        {{ currency(price_of_pricing.discount) }}
                        {{ CURRENCY }}
                    </div>
                </div>
                <div v-if="price_of_pricing.payment" class="grid grid-cols-3 mb-2 gap-x-2">
                    <div class="text-slate-500 md:text-right">
                        {{ $t('v1.view.main.dashboard.pricing.detail.payment') }}
                    </div>
                    <div class="font-bold text-red-500 col-span-2">
                        {{ currency(price_of_pricing.payment) }}
                        {{ CURRENCY }}
                    </div>
                </div>
            </div>
            <hr v-if="price_of_pricing.payment" class="mb-2" />
        </template>
        <template v-slot:footer>
            <div class="flex justify-center">
                <button @click="createPricing" :disabled="!price_of_pricing.payment"
                    :class="!price_of_pricing.payment ? 'bg-slate-500' : ''"
                    class="bg-orange-500 text-white px-5 rounded-full py-1">
                    {{ $t('v1.view.main.dashboard.pricing.create_pricing') }}
                </button>
            </div>
        </template>
    </Modal>
</template>
<script setup lang="ts">
import { copy, currency } from '@/service/helper/format'
import { onMounted, ref, watch } from 'vue'
import { flow } from '@/service/helper/async'
import {
    calc_price_of_pricing, create_pricing
} from '@/service/api/chatbox/n4-service'
import { toast } from '@/service/helper/alert'
import { useI18n } from 'vue-i18n'

import Select from '@/components/Select.vue'
import Option from '@/components/Option.vue'
import Modal from '@/components/Modal.vue'
import Loading from '@/components/Loading.vue'

import type { CbError } from '@/service/interface/function'
import type { CreatePricing } from '@/service/interface/app/pricing'
import type { ComponentRef } from '@/service/interface/vue'

const $emit = defineEmits(['done_create_pricing'])

const { t: $t } = useI18n()

/**đơn vị tiền tệ được sử dụng */
const CURRENCY = 'VND'
/**danh sách các loại gói */
const CODE_LIST = [
    'UNLIMITED_12_UNLIMITED',
    'UNLIMITED_12_30',
    'UNLIMITED_12_60',
    'CUSTOM'
]
/**ước lượng chi phí của gói */
const PRICE_ROOT = {
    price: 0,
    cost_staff: 0,
    discount: 0,
    payment: 0,
}
/**data để tạo mới gói */
const create_pricing_data = ref<CreatePricing>({
    code: 'UNLIMITED_12_UNLIMITED',
    selected_page: '1',
    selected_month: '6',
    selected_staff: '3',
})
/**ước lượng chi phí của gói */
const price_of_pricing = ref(copy(PRICE_ROOT))
/**ref của modal tạo gói */
const create_pricing_ref = ref<ComponentRef>()
/**loading */
const is_loading_calc_price = ref(false)

/**theo dõi sự thay đổi của các tuỳ chọn, để từ đó tính toán số tiền */
watch(() => create_pricing_data, () => calcPriceOfPricing(), { deep: true })

onMounted(() => calcPriceOfPricing())

/**parser number cho các dữ liệu */
function formatInputPricing() {
    return {
        code: create_pricing_data.value.code,
        selected_page: Number(create_pricing_data.value.selected_page),
        selected_month: Number(create_pricing_data.value.selected_month),
        selected_staff: Number(create_pricing_data.value.selected_staff),
    }
}
/**tính toán trước số tiền phải trả của gói được chọn */
function calcPriceOfPricing() {
    // kích hoạt loading
    is_loading_calc_price.value = true

    calc_price_of_pricing(formatInputPricing(), (e, r) => {
        // tắt loading
        is_loading_calc_price.value = false

        // nếu không đúng thì reset ước tính
        if (e) price_of_pricing.value = copy(PRICE_ROOT)
        // nếu đúng thì ghi ước tính mới
        else price_of_pricing.value = r
    })
}
/**tạo mới gói */
function createPricing() {
    flow([
        // * gọi api tạo mới gói
        (cb: CbError) => create_pricing(formatInputPricing(), (e, r) => {
            if (e) return cb(e)

            // thông báo
            toast('success', $t('v1.view.main.dashboard.pricing.create.success'))

            // tắt modal tạo gói
            create_pricing_ref.value.toggleModal()

            // call ra bên ngoài
            $emit('done_create_pricing', r)
            cb()
        }),
    ], undefined, true)
}

/**mở modal */
function openCreatePricing() {
    create_pricing_ref.value.toggleModal()
}

defineExpose({ openCreatePricing })
</script>