<template>
    <Modal ref="upsert_widget_ref">
        <template v-slot:header>
            <template v-if="widget">
                {{ widget?.name }}
            </template>
            <template v-else>
                {{ $t('v1.view.main.dashboard.widget.create.title') }}
            </template>
        </template>
        <template v-slot:body>
            <div
                class="h-[calc(100vh_-_217px)] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-x-5">
                <div>
                    <Title :title="$t('v1.view.main.dashboard.widget.create.form.name')" />
                    <input v-model="upsert_widget_data.name"
                        :placeholder="$t('v1.view.main.dashboard.widget.create.form.name_description')" type="text"
                        class="w-full focus:outline-none rounded-md border py-1 px-2">
                </div>
                <div>
                    <Title :title="$t('v1.view.main.dashboard.widget.create.form.company')" />
                    <input v-model="upsert_widget_data.partner_name"
                        :placeholder="$t('v1.view.main.dashboard.widget.create.form.company_description')" type="text"
                        class="w-full focus:outline-none rounded-md border py-1 px-2">
                </div>
                <div>
                    <Title :title="$t('v1.view.main.dashboard.widget.create.form.app_url')" />
                    <input v-model="upsert_widget_data.url_app"
                        :placeholder="$t('v1.view.main.dashboard.widget.create.form.app_url_description')" type="text"
                        class="w-full focus:outline-none rounded-md border py-1 px-2">
                </div>
                <div>
                    <Title :title="$t('v1.view.main.dashboard.widget.create.form.app_oauth')" />
                    <input v-model="upsert_widget_data.url_auth"
                        :placeholder="$t('v1.view.main.dashboard.widget.create.form.app_oauth_description')" type="text"
                        class="w-full focus:outline-none rounded-md border py-1 px-2">
                </div>
                <div>
                    <Title :title="$t('v1.view.main.dashboard.widget.create.form.icon')" />
                    <input v-model="upsert_widget_data.icon"
                        :placeholder="$t('v1.view.main.dashboard.widget.create.form.icon_description')" type="text"
                        class="w-full focus:outline-none rounded-md border py-1 px-2">
                </div>
                <div>
                    <Title :title="$t('v1.view.main.dashboard.widget.create.form.mini_icon')" />
                    <input v-model="upsert_widget_data.mini_icon"
                        :placeholder="$t('v1.view.main.dashboard.widget.create.form.mini_icon_description')" type="text"
                        class="w-full focus:outline-none rounded-md border py-1 px-2">
                </div>
                <div>
                    <Title :title="$t('v1.view.main.dashboard.widget.create.form.role')" />
                    <div v-if="upsert_widget_data.access_role">
                        <Role :access_role_select="upsert_widget_data.access_role"
                            @update="$event => upsert_widget_data.access_role = $event" />
                    </div>
                </div>
                <div>
                    <Title :title="$t('v1.view.main.dashboard.widget.create.form.description')" />
                    <textarea v-model="upsert_widget_data.description"
                        :placeholder="$t('v1.view.main.dashboard.widget.create.form.description')"
                        class="w-full focus:outline-none rounded-md border py-1 px-2" rows="7" />
                    <Title :title="$t('v1.view.main.dashboard.widget.create.form.guild')" />
                    <textarea v-model="upsert_widget_data.document"
                        :placeholder="$t('v1.view.main.dashboard.widget.create.form.guild')"
                        class="w-full focus:outline-none rounded-md border py-1 px-2" rows="7" />
                </div>
                <div>
                    <Title :title="$t('v1.view.main.dashboard.widget.special')" />
                    <div @click="upsert_widget_data.is_post_message = !upsert_widget_data.is_post_message" class="flex items-center cursor-pointer">
                        <input v-model="upsert_widget_data.is_post_message" type="checkbox" class="accent-orange-600 w-[20px] h-[20px]">
                        <div class="ml-2">
                            {{ $t('v1.view.main.dashboard.widget.special_list.no_reload') }}
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <div class="grid grid-cols-2 gap-2">
                <FilterButton @click="toggleModal" type="text-slate-500 hover:text-white hover:bg-slate-500"
                    :title="$t('v1.common.cancel')" />
                <FilterButton v-if="widget" @click="updateWidget"
                    type="border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500"
                    :title="$t('v1.common.update')" />
                <FilterButton v-else @click="createWidget"
                    type="border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500"
                    :title="$t('v1.common.create')" />
            </div>
        </template>
    </Modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { watch } from 'vue'
import { create_widget, update_my_widget } from '@/service/api/chatbox/n5-app'
import { flow } from '@/service/helper/async'
import { useChatbotUserStore } from '@/stores'
import { toast } from '@/service/helper/alert'

import Modal from '@/components/Modal.vue'
import FilterButton from '@/views/ChatWarper/Menu/FilterModal/FilterButton.vue'
import Title from '@/views/Dashboard/Widget/Title.vue'
import Role from '@/views/Dashboard/Widget/Role.vue'

import type { ComponentRef } from '@/service/interface/vue'
import type { AppInfo, InputCreateWidget } from '@/service/interface/app/widget'
import type { CbError } from '@/service/interface/function'

const $emit = defineEmits(['reload'])

const $props = withDefaults(defineProps<{
    /**giá trị widget đang chọn, nếu không tồn tại thì là tạo mới */
    widget?: AppInfo
}>(), {})

const $t = useI18n().t
const chatbotUserStore = useChatbotUserStore()

/**khối dữ liệu của widget */
const upsert_widget_data = ref<InputCreateWidget>({
    name: '',
    partner_name: '',
    url_app: '',
    url_auth: '',
    icon: '',
    mini_icon: '',
    description: '',
    document: '',
    access_role: {
        public_profile: true,
        conversation_message: false,
        conversation_contact: false,
        conversation_label: false,
        conversation_last_note: false,
        conversation_staff: false,
        conversation_chatbot: false
    },
    user_created: chatbotUserStore.chatbot_user?._id as string,
    fb_as_id: chatbotUserStore.chatbot_user?.fb_staff_id as string,
    // TODO các field dưới này được fix tạm, sau này sẽ sửa lại api
    category_id: '5efc6a0a29e97d0bf1cef11d',
    email: ' ',
    phone: ' ',
    website_offical: ' ',
    partner_icon: ' ',
    is_post_message: false
})
/**ref của modal */
const upsert_widget_ref = ref<ComponentRef>()

watch(() => $props.widget, () => setDefaultValueSetting())

/**kiểm tra đầu vào */
function verifyInput() {
    if (
        !upsert_widget_data.value.name ||
        !upsert_widget_data.value.partner_name ||
        !upsert_widget_data.value.url_app ||
        !upsert_widget_data.value.url_auth ||
        !upsert_widget_data.value.icon ||
        !upsert_widget_data.value.mini_icon ||
        !upsert_widget_data.value.description ||
        !upsert_widget_data.value.document
    ) return false

    return true
}
/**tạo mới widget */
function createWidget() {
    flow([
        // * kiểm tra đầu vào
        (cb: CbError) => {
            if (
                !verifyInput()
            ) return cb($t('v1.view.main.dashboard.widget.create.form.not_empty'))

            cb()
        },
        // * tạo mới widget
        (cb: CbError) => create_widget(upsert_widget_data.value, (e, r) => {
            if (e) return cb(e)

            cb()
        }),
        // * thông báo, tăt modal
        (cb: CbError) => {
            toast('success', $t('v1.view.main.dashboard.widget.create.form.create_success'))

            toggleModal()

            $emit('reload')

            cb()
        },
    ], undefined, true)
}
/**cài đặt widget */
function updateWidget() {
    if (!$props.widget?._id) return

    flow([
        // * kiểm tra đầu vào
        (cb: CbError) => {
            if (
                !verifyInput()
            ) return cb($t('v1.view.main.dashboard.widget.create.form.not_empty'))

            cb()
        },
        // * cập nhật widget
        (cb: CbError) => update_my_widget({
            _id: $props.widget?._id as string,
            ...upsert_widget_data.value,
        }, (e, r) => {
            if (e) return cb(e)

            cb()
        }),
        // * thông báo, tăt modal
        (cb: CbError) => {
            toast('success', $t('v1.view.main.dashboard.widget.create.form.update_success'))

            toggleModal()

            $emit('reload')

            cb()
        },
    ], undefined, true)
}
/**thiết lập các cài đặt mặc định cho widget */
function setDefaultValueSetting() {
    if (!$props.widget) return

    upsert_widget_data.value.name = $props.widget?.name
    upsert_widget_data.value.partner_name = $props.widget?.partner_name
    upsert_widget_data.value.url_app = $props.widget?.url_app
    upsert_widget_data.value.url_auth = $props.widget?.url_auth
    upsert_widget_data.value.icon = $props.widget?.icon
    upsert_widget_data.value.mini_icon = $props.widget?.mini_icon
    upsert_widget_data.value.description = $props.widget?.description
    upsert_widget_data.value.document = $props.widget?.document
    upsert_widget_data.value.access_role = $props.widget?.access_role
    upsert_widget_data.value.is_post_message = $props.widget?.is_post_message
}
/**mở modal của pricing detail */
function toggleModal() {
    upsert_widget_ref.value.toggleModal()
}

defineExpose({ toggleModal })
</script>