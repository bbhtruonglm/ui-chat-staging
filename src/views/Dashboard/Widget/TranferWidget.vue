<template>
    <Modal ref="tranfer_widget_ref">
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.widget.create.tranfer.title') }}
        </template>
        <template v-slot:body>
            <div class="text-slate-500">
                {{ $t('v1.view.main.dashboard.widget.create.tranfer.guild_copy') }}
            </div>
            <div class="text-center">
                <button @click="copyId" class="mt-2 rounded-md text-white bg-blue-500 px-5 w-full md:w-auto">
                    {{ chatbotUserStore.chatbot_user?._id }}
                </button>
            </div>
            <div class="mt-5 text-slate-500">
                {{ $t('v1.view.main.dashboard.widget.create.tranfer.guild_tranfer') }}
            </div>
            <div class="text-center flex">
                <input v-model="user_created" type="text" class="border rounded-md w-[calc(100%_-_142px)] mr-2 focus:outline-none px-2"
                    :placeholder="$t('v1.view.main.dashboard.widget.create.tranfer.id')">
                <button @click="updateWidget" class="text-white bg-red-500 rounded py-1 px-2">
                    {{ $t('v1.view.main.dashboard.widget.create.tranfer.action') }}
                </button>
            </div>
        </template>
    </Modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { update_my_widget } from '@/service/api/chatbox/n5-app'
import { flow } from '@/service/helper/async'
import { useChatbotUserStore } from '@/stores'
import { toast } from '@/service/helper/alert'

import Modal from '@/components/Modal.vue'

import type { ComponentRef } from '@/service/interface/vue'
import type { AppInfo } from '@/service/interface/app/widget'
import type { CbError } from '@/service/interface/function'
import { copyToClipboard } from '@/service/helper/copyWithAlert'

const $emit = defineEmits(['reload'])

const $props = withDefaults(defineProps<{
    /**giá trị widget đang chọn, nếu không tồn tại thì là tạo mới */
    widget?: AppInfo
}>(), {})

const $t = useI18n().t
const chatbotUserStore = useChatbotUserStore()

/**ref của modal */
const tranfer_widget_ref = ref<ComponentRef>()
/**id chủ mới */
const user_created = ref<string>()

/**sao chép mã người dùng */
function copyId() {
    if (!chatbotUserStore.chatbot_user?._id) return

    copyToClipboard(
        chatbotUserStore.chatbot_user?._id,
        $t('v1.view.main.dashboard.widget.create.tranfer.copy')
    )
}
/**chuyển nhượng widget */
function updateWidget() {
    if (!$props.widget?._id) return

    flow([
        // * verify input
        (cb: CbError) => {
            if (!user_created.value)
                return cb($t('v1.view.main.dashboard.widget.create.form.not_empty'))

            cb()
        },
        // * cập nhật widget
        (cb: CbError) => update_my_widget({
            _id: $props.widget?._id as string,
            _type: 'tranfer',
            user_created: user_created.value
        }, (e, r) => {
            if (e) return cb(e)

            cb()
        }),
        // * thông báo, tăt modal
        (cb: CbError) => {
            toast('success', $t('v1.view.main.dashboard.widget.create.tranfer.success'))

            toggleModal()

            $emit('reload')

            cb()
        },
    ], undefined, true)
}
/**mở modal của pricing detail */
function toggleModal() {
    tranfer_widget_ref.value.toggleModal()
}

defineExpose({ toggleModal })
</script>