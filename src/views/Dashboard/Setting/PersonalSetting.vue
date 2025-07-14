<template>
    <Modal ref="personal_setting_ref">
        <template v-slot:header>
            <div class="flex items-center">
                <div>{{ $t('v1.view.main.dashboard.setting.personal_setting.title') }}</div>
            </div>
        </template>
        <template v-slot:body>
            <div class="md:w-[500px] w-full py-3">
                <div class="flex justify-between items-center">
                    <div class="flex">
                        <div class="">{{ $t('v1.view.main.dashboard.setting.personal_setting.allow_overide') }}</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" v-model="is_enable_personal_setting" class="sr-only peer"
                            @change="toogleEnablePersonalSetting()">
                        <div
                            class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500">
                        </div>
                    </label>
                </div>
            </div>
            <div class="md:w-[500px] w-full py-3" v-if="is_enable_personal_setting">
                <div class="flex justify-between items-center">
                    <div class="flex">
                        <div class="">{{ $t('v1.view.main.dashboard.setting.personal_setting.hide_page_avatar') }}</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" v-model="personal_setting.is_hide_page_avatar" class="sr-only peer">
                        <div
                            class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500">
                        </div>
                    </label>
                </div>
                <div class="mt-4 md:flex md:items-center md:justify-between">
                    <div class="mb-2">{{ $t('v1.view.main.dashboard.setting.personal_setting.label_display_mode') }}</div>
                    <select v-model="personal_setting.display_label_type"
                        class="border px-2 py-1.5 rounded-lg w-full md:w-fit">
                        <option value="FULL">{{ $t('v1.view.main.dashboard.setting.personal_setting.dot_with_color') }}</option>
                        <option value="ICON">{{ $t('v1.view.main.dashboard.setting.personal_setting.just_show_text') }}</option>
                        <option value="ICON_TOOLTIP">{{ $t('v1.view.main.dashboard.setting.personal_setting.dot_with_color_and_toottip') }}</option>
                    </select>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <div class="flex justify-center w-full mb-2" @click="savePersonalSetting()" v-if="is_enable_personal_setting">
                <button class="bg-orange-500 text-white px-3 py-1.5 rounded-lg">
                    {{ $t('v1.common.update') }}
                </button>
            </div>
        </template>
    </Modal>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useChatbotUserStore } from '@/stores'

import Modal from '@/components/Modal.vue'

import type { ComponentRef } from '@/service/interface/vue'

import { getItem, setItem } from '@/service/helper/localStorage'

const $t = useI18n().t

/** Store user */
const chatbotUserStore = useChatbotUserStore()

/** Ref của modal */
const personal_setting_ref = ref<ComponentRef>()
/** Thiết lập cá nhân của người dùng */
const personal_setting = ref<{
    [index: string]: boolean | string
}>(chatbotUserStore.personal_settings)
/** Có mở chế độ ghi đè setting của page hay không */
const is_enable_personal_setting = ref<boolean>(
    // chatbotUserStore.is_enable_personal_setting
)

/** Mở modal của pricing detail */
function toggleModal() {
    personal_setting_ref.value.toggleModal()
}
/** Lưu thiết lập cá nhâ từ local storage */
function savePersonalSetting() {
    // * Lưu lại vào local storage
    setItem('personal_settings', personal_setting.value)

    // * Lưu lại giá trị vào store
    // chatbotUserStore.personal_settings = personal_setting.value

    // * Tắt modal
    toggleModal()
}
/** Bật tắt chế độ ghi đè thiết lập page */
function toogleEnablePersonalSetting() {
    if (is_enable_personal_setting.value) {
        setItem('is_enable_personal_setting', 'yes')
        // chatbotUserStore.is_enable_personal_setting = true
    } else {
        setItem('is_enable_personal_setting', 'no')
        // chatbotUserStore.is_enable_personal_setting = false
    }
}

defineExpose({ toggleModal })
</script>