<template>
    <div class="w-full h-full pt-[70px] md:pt-8 xl:pt-5">
        <div class="pl-14 md:pl-4 xl:pl-0 font-semibold text-lg">
            {{ $t('v1.view.main.dashboard.download.page_list') }}
            <span class="text-sm text-slate-500 font-normal">
                ({{ $t('v1.view.main.dashboard.download.alert') }})
            </span>
        </div>
        <div class="p-2">
            <div
                class="h-[110px] overflow-y-auto flex items-center flex-wrap border rounded-lg p-2 justify-center">
                <div v-if="list_page?.length" v-for="page of list_page" class="flex items-center mr-4 mb-1">
                    <PageAvatar :page_info="page.page"
                    class="rounded-full w-8 h-8" />
                    <div class="text-slate-500 font-semibold ml-1">
                        {{ page?.page?.name }}
                    </div>
                </div>
                <div v-else class="font-medium text-red-500">
                    {{ $t('v1.view.main.dashboard.download.empty_page') }}
                </div>
            </div>
            <div
                class="h-[250px] overflow-y-auto border rounded-lg p-2 mt-2 grid grid-cols-2 gap-2">
                <div class="text-right font-semibold text-slate-500">
                    {{ $t('v1.view.main.dashboard.download.total') }}
                </div>
                <div class="font-semibold text-green-500">
                    {{ Number(total_conversation || 0).toLocaleString() }}
                </div>

                <div class="text-right font-semibold text-slate-500">
                    {{ $t('v1.view.main.dashboard.chat.filter.interact.title') }}
                </div>
                <div class="font-semibold">
                    <span v-if="conversationStore.option_filter_page_data.display_style === 'INBOX'">
                        {{ $t('v1.view.main.dashboard.chat.filter.interact.message') }}
                    </span>
                    <span v-else-if="conversationStore.option_filter_page_data.display_style === 'COMMENT'">
                        {{ $t('v1.view.main.dashboard.chat.filter.interact.comment') }}
                    </span>
                    <span v-else>
                        {{ $t('v1.view.main.dashboard.download.no') }}
                    </span>
                </div>

                <div class="text-right font-semibold text-slate-500">
                    {{ $t('v1.view.main.dashboard.chat.filter.message.title') }}
                </div>
                <div class="font-semibold">
                    <div v-if="conversationStore.option_filter_page_data.unread_message">
                        {{ $t('v1.view.main.dashboard.chat.filter.message.unread') }}
                    </div>
                    <div v-if="conversationStore.option_filter_page_data.not_response_client">
                        {{ $t('v1.view.main.dashboard.chat.filter.message.not_reply') }}
                    </div>
                    <div v-if="conversationStore.option_filter_page_data.not_exist_label">
                        {{ $t('v1.view.main.dashboard.chat.filter.message.not_tag') }}
                    </div>
                    <div v-if="conversationStore.option_filter_page_data.is_spam_fb === 'YES'">
                        {{ $t('v1.view.main.dashboard.chat.filter.message.spam') }}
                    </div>
                    <span v-if="!conversationStore.option_filter_page_data.unread_message &&
                !conversationStore.option_filter_page_data.not_response_client &&
                !conversationStore.option_filter_page_data.not_exist_label &&
                conversationStore.option_filter_page_data.is_spam_fb !== 'YES'">
                        {{ $t('v1.view.main.dashboard.download.no') }}
                    </span>
                </div>

                <div class="text-right font-semibold text-slate-500">
                    {{ $t('v1.view.main.dashboard.chat.filter.phone.title') }}
                </div>
                <div class="font-semibold">
                    <span v-if="conversationStore.option_filter_page_data.have_phone === 'YES'">
                        {{ $t('v1.view.main.dashboard.chat.filter.phone.include_phone') }}
                    </span>
                    <span v-else-if="conversationStore.option_filter_page_data.have_phone === 'NO'">
                        {{ $t('v1.view.main.dashboard.chat.filter.phone.exclude_phone') }}
                    </span>
                    <span v-else>
                        {{ $t('v1.view.main.dashboard.download.no') }}
                    </span>
                </div>

                <div class="text-right font-semibold text-slate-500">
                    {{ $t('v1.view.main.dashboard.chat.filter.time.title') }}
                </div>
                <div class="font-semibold">
                    <span v-if="conversationStore.option_filter_page_data?.time_range">
                        {{ formatDateDiplay(conversationStore.option_filter_page_data?.time_range?.gte) }}
                        -
                        {{ formatDateDiplay(conversationStore.option_filter_page_data?.time_range?.lte) }}
                    </span>
                    <span v-else>
                        {{ $t('v1.view.main.dashboard.download.no') }}
                    </span>
                </div>
                <div class="text-right font-semibold text-slate-500">
                    {{ $t('v1.view.main.dashboard.chat.filter.label.title') }}
                </div>
                <div class="font-semibold flex flex-wrap">
                    <template v-for="label_id of conversationStore.option_filter_page_data.label_id">
                        <div v-if="labels?.[label_id]" class="flex items-center mr-2">
                            <div class="w-[15px] h-[15px] rounded-full"
                                :style="{ background: labels?.[label_id]?.bg_color }" />
                            <div class="ml-1">
                                {{ labels?.[label_id]?.title }}
                            </div>
                        </div>
                    </template>
                    <span v-if="!conversationStore.option_filter_page_data.label_id?.length">
                        {{ $t('v1.view.main.dashboard.download.no') }}
                    </span>
                </div>
                <div class="text-right font-semibold text-slate-500">
                    {{ $t('v1.view.main.dashboard.chat.filter.exclude_label.title') }}
                </div>
                <div class="font-semibold flex flex-wrap">
                    <template v-for="label_id of conversationStore.option_filter_page_data.not_label_id">
                        <div v-if="labels?.[label_id]" class="flex items-center mr-2">
                            <div class="w-[15px] h-[15px] rounded-full"
                                :style="{ background: labels?.[label_id]?.bg_color }" />
                            <div class="ml-1">
                                {{ labels?.[label_id]?.title }}
                            </div>
                        </div>
                    </template>
                    <span v-if="!conversationStore.option_filter_page_data.not_label_id?.length">
                        {{ $t('v1.view.main.dashboard.download.no') }}
                    </span>
                </div>
                <div class="text-right font-semibold text-slate-500">
                    {{ $t('v1.view.main.dashboard.chat.filter.staff.title') }}
                </div>
                <div class="font-semibold flex flex-wrap">
                    <template v-for="staff_id of conversationStore.option_filter_page_data.staff_id">
                        <div v-if="staffs?.[staff_id]" class="flex items-center mr-2">
                            <StaffAvatar :id="staff_id" class="rounded-full w-5 h-5" />
                            <div class="ml-1">
                                {{ staffs?.[staff_id]?.name }}
                            </div>
                        </div>
                    </template>
                    <span v-if="!conversationStore.option_filter_page_data.not_label_id?.length">
                        {{ $t('v1.view.main.dashboard.download.no') }}
                    </span>
                </div>
            </div>
            <div v-if="calcPercent()" class="w-full bg-gray-200 rounded-lg mt-5">
                <div class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-lg h-[50px] flex items-center justify-center"
                    :style="{ width: `${calcPercent()}%` }">
                    {{ calcPercent() }} %
                </div>
            </div>
            <div class="flex justify-center mt-5">
                <div class="mr-2">
                    <button @click="openDownloadPage"
                        class="text-white bg-green-500 hover:brightness-105 rounded-lg px-2 py-1">
                        {{ $t('v1.view.main.dashboard.download.start_download') }}
                    </button>
                </div>
                <div v-if="getPageId()?.length">
                    <button @click="createDownloadData"
                        class="text-white bg-blue-500 hover:brightness-125 rounded-lg px-2 py-1">
                        {{ $t('v1.view.main.dashboard.download.create_data') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePageStore, useConversationStore, useChatbotUserStore } from '@/stores'
import { onMounted, ref } from 'vue'
import { map } from 'lodash'
import { format } from 'date-fns'
import { count_conversation, read_me_chatbot_user } from '@/service/api/chatbox/n4-service'
import { create_download } from '@/service/api/chatbox/n8-merge'
import { waterfall } from 'async'
import { useI18n } from 'vue-i18n'

import PageAvatar from '@/components/Avatar/PageAvatar.vue'
import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'

import type { ILabel } from '@/service/interface/app/label'
import type { StaffInfo } from '@/service/interface/app/staff'
import { getSelectedPageInfo, isCurrentStaffIsPageAdmin, openNewTab } from '@/service/function'
import type { Cb, CbError } from '@/service/interface/function'
import { confirm, toast, toastError } from '@/service/helper/alert'
import type { PageData } from '@/service/interface/app/page'
import { flow } from '@/service/helper/async'

const pageStore = usePageStore()
const conversationStore = useConversationStore()
const chatbotUserStore = useChatbotUserStore()
const $t = useI18n().t

onMounted(() => getPageInfo((e, r) => {
    getLabelList()
    getStaffs()
    countTotalConversationValid()
    checkStatus()
}))

/**danh sách các trang thoả mãn việc download */
const list_page = ref<PageData[]>([])
/**đếm tổng số khách hàng thoả mãn điều kiện lọc */
const total_conversation = ref<number>()
/** Danh sách label của page đang được chọn */
const labels = ref<{ [index: string]: ILabel }>({})
/** Danh sách nhân viên */
const staffs = ref<{ [index: string]: StaffInfo }>({})

/**đọc dữ liệu của các trang sẽ được tải dữ liệu */
function getPageInfo(proceed: Cb) {
    flow([
        // * đọc thông tin trang
        (cb: CbError) => getSelectedPageInfo($t, (e, r) => {
            if (e) return cb(e)

            cb()
        }),
        // * lọc ra các trang thoả mãn (user là admin trang)
        (cb: CbError) => {
            list_page.value = map(pageStore.selected_page_list_info)?.filter(page => {
                // nếu không có id page thì không cho hiện
                if (!page.page?.fb_page_id) return false

                // chỉ cho hiện các page mà user là admin
                return isCurrentStaffIsPageAdmin(page.page?.fb_page_id)
            })

            cb()
        },
    ], proceed, true)
}
/**lấy ra id các trang thoả mãn */
function getPageId(): string[] {
    return list_page
        .value
        ?.map(page => page.page?.fb_page_id)
        // lọc bỏ các giá trị không tồn tại
        ?.filter(n => n) as string[]
}
/**format lại hiển thị thời gian */
function formatDateDiplay(value?: number) {
    if (!value) return ''

    return format(value, 'dd/MM/yy HH:mm')
}
/** Lấy danh sách nhãn */
function getLabelList() {
    map(pageStore.selected_page_list_info, (item) => {
        labels.value = { ...labels.value, ...item.label_list }
    })
}
/** Lấy danh sách nhân viên */
function getStaffs() {
    map(pageStore.selected_page_list_info, item => {
        staffs.value = { ...staffs.value, ...item.staff_list }
    })
}
/**tính tổng số khách hàng sẽ tải */
function countTotalConversationValid() {
    // nếu không có id trang thoả mãn thì thôi
    if (!getPageId()?.length) return

    count_conversation(
        {
            ...{ page_id: getPageId() },
            ...conversationStore.option_filter_page_data
        },
        (e, r) => total_conversation.value = r
    )
}
/**mở trang để tải dữ liệu */
function openDownloadPage() {
    // openNewTab(`${$env.host.download_client}${chatbotUserStore.chatbot_user?._id}`)
}
/**đọc trạng thái */
function getDownloadStatus(proceed: Cb) {
    read_me_chatbot_user((e, r) => {
        if (e || !r) return

        // cập nhật store
        chatbotUserStore.chatbot_user = r

        proceed()
    })
}
/**tính toán phần trăm hoàn thành */
function calcPercent() {
    if (
        !chatbotUserStore.chatbot_user?.download?.current ||
        !chatbotUserStore.chatbot_user?.download?.total
    ) return 0

    return Math.round(
        chatbotUserStore.chatbot_user?.download?.current
        /
        chatbotUserStore.chatbot_user?.download?.total * 100
    )
}
/**kiểm tra trạng thái liên tục khi tạo tệp */
function checkStatus() {
    setTimeout(() => getDownloadStatus(() => {
        if (chatbotUserStore.chatbot_user?.download?.status !== 'DONE') checkStatus()
    }), 1000)
}
/**tạo dữ liệu  */
function createDownloadData() {
    /**đầu vào api */
    let query: any = {}
    waterfall([
        // * cảnh báo trước khi tạo
        (cb: CbError) => confirm(
            'warning',
            $t('v1.view.main.dashboard.download.create_data'),
            $t('v1.view.main.dashboard.download.warning'),
            (e, r) => {
                if (e) return

                cb()
            }
        ),
        // * khởi tạo query
        (cb: CbError) => {
            query = {
                fb_page_id: getPageId()?.join(' '),
                fb_staff_id: conversationStore.option_filter_page_data.staff_id?.join(' '),
                display_style: conversationStore.option_filter_page_data.display_style,
                unread_message: conversationStore.option_filter_page_data.unread_message,
                time_range: conversationStore.option_filter_page_data.time_range,
                label_id: conversationStore.option_filter_page_data.label_id?.join(' '),
                not_label_id: conversationStore.option_filter_page_data.not_label_id?.join(' '),
                not_exist_label: conversationStore.option_filter_page_data.not_exist_label,
                not_response_client: conversationStore.option_filter_page_data.not_response_client,
                label_and: conversationStore.option_filter_page_data.label_and,
                is_spam_fb: conversationStore.option_filter_page_data.is_spam_fb,
            }

            if (conversationStore.option_filter_page_data.have_phone)
                query.have_phone = conversationStore.option_filter_page_data.have_phone?.toLowerCase()

            cb()
        },
        // * bắt đầu tạo file để tải về
        (cb: CbError) => create_download({ query }, (e, r) => {
            if (e || !r) return cb($t('v1.view.main.dashboard.download.faild'))

            cb()
        }),
    ], e => {
        if (e) return toastError(e)

        toast('success', $t('v1.view.main.dashboard.download.success'))

        checkStatus()
    })
}
</script>