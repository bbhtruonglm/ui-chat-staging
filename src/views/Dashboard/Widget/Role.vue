<template>
    <div @click="toggleRole(key)" v-for="(role, key) of role_list" class="flex items-center border-b py-1 cursor-pointer">
        <div class="w-[25px] h-[25px]">
            <img :src="role.icon" class="w-full h-full" />
        </div>
        <div class="ml-3 w-[calc(100%_-_77px)]">
            <div class="truncate">
                {{ role.title }}
            </div>
            <div class="text-slate-500 truncate">
                {{ role.description }}
            </div>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
            <input :checked="getRoleValue(key)" disabled type="checkbox" class="sr-only peer">
            <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-orange-600">
            </div>
        </label>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import conversationContactSvg from '@/assets/icons/conversation_contact.svg'
import conversationLabelSvg from '@/assets/icons/conversation_label.svg'
import conversationLastNoteSvg from '@/assets/icons/conversation_last_note.svg'
import conversationMessageSvg from '@/assets/icons/conversation_message.svg'
import conversationStaffSvg from '@/assets/icons/conversation_staff.svg'
import publicProfileSvg from '@/assets/icons/public_profile.svg'
import conversationChatbotSvg from '@/assets/imgs/chatbox.svg'

import type { AccessRoleInfo } from '@/service/interface/app/widget'
import { computed } from 'vue'
import { get, set } from 'lodash'

const $emit = defineEmits(['update'])

const $props = withDefaults(defineProps<{
    /**giá trị widget đang chọn */
    access_role_select: AccessRoleInfo
}>(), {})

const $t = useI18n().t

/**các quyền có thể cài đặt */
const role_list = ref<{
    [index: string]: {
        title: string
        description: string
        icon: string
    }
}>({
    public_profile: {
        title: $t('v1.view.main.dashboard.widget.role_list.public_profile.title'),
        description: $t('v1.view.main.dashboard.widget.role_list.public_profile.description'),
        icon: publicProfileSvg,
    },
    conversation_message: {
        title: $t('v1.view.main.dashboard.widget.role_list.conversation_message.title'),
        description: $t('v1.view.main.dashboard.widget.role_list.conversation_message.description'),
        icon: conversationMessageSvg,
    },
    conversation_contact: {
        title: $t('v1.view.main.dashboard.widget.role_list.conversation_contact.title'),
        description: $t('v1.view.main.dashboard.widget.role_list.conversation_contact.description'),
        icon: conversationContactSvg,
    },
    conversation_label: {
        title: $t('v1.view.main.dashboard.widget.role_list.conversation_label.title'),
        description: $t('v1.view.main.dashboard.widget.role_list.conversation_label.description'),
        icon: conversationLabelSvg,
    },
    conversation_last_note: {
        title: $t('v1.view.main.dashboard.widget.role_list.conversation_last_note.title'),
        description: $t('v1.view.main.dashboard.widget.role_list.conversation_last_note.description'),
        icon: conversationLastNoteSvg,
    },
    conversation_staff: {
        title: $t('v1.view.main.dashboard.widget.role_list.conversation_staff.title'),
        description: $t('v1.view.main.dashboard.widget.role_list.conversation_staff.description'),
        icon: conversationStaffSvg,
    },
    conversation_chatbot: {
        title: $t('v1.view.main.dashboard.widget.role_list.conversation_chatbot.title'),
        description: $t('v1.view.main.dashboard.widget.role_list.conversation_chatbot.description'),
        icon: conversationChatbotSvg,
    },
})

/**giá trị của các lựa chọn */
const role_select = computed({
    // lấy dữ liệu từ prop
    get() {
        return $props.access_role_select
    },
    // khi có thay đổi thì emit ra ngoài
    set(val) {
        $emit('update', val)
    }
})

/**thay đổi cài đặt quyền */
function toggleRole(key: string | number) {
    set(role_select.value, [key], !getRoleValue(key))
}
/**lấy dữ liệu hiện tại của role */
function getRoleValue(key: string | number) {
    return get(role_select.value, [key])
}
</script>