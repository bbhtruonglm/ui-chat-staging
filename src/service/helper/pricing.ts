import { eachOfLimit, waterfall } from 'async'
import { useChatbotUserStore, useCommonStore, usePageStore } from '@/stores'
import { keys, size } from 'lodash'

import type { Cb, CbError } from '@/service/interface/function'
import type { ChatbotUserInfo } from '@/service/interface/app/chatbot_user'
import type { IPage, PageInfo } from '@/service/interface/app/page'

/**kiểm tra xem user có đang được kích hoạt gói hay không */
export const isActiveUser = (chatbot_user?: ChatbotUserInfo) => {
    const CURRENT_DATE = new Date().getTime()

    // nếu user có gói thì cho qua
    if (
        chatbot_user?.pricing_id &&
        chatbot_user?.end_date &&
        new Date(chatbot_user?.end_date).getTime() > CURRENT_DATE
    ) return true

    return false
}

/**kiểm tra xem page có được kích hoạt gói hay không */
export const isActivePage = (page?: IPage) => {
    const CURRENT_DATE = new Date().getTime()

    // nếu là page nội bộ thì cho qua
    if (page?.is_internal) return true

    // nếu là page dùng thử thì cho qua
    if (
        page?.end_date_trial &&
        new Date(page?.end_date_trial).getTime() > CURRENT_DATE
    ) return true

    // nếu page đang có gói và chưa hết hạn thì cho qua
    if (
        page?.pricing_id &&
        page?.end_date &&
        new Date(page?.end_date).getTime() > CURRENT_DATE
    ) return true

    // chặn nếu page bị gắn cờ từ hệ thống
    if (page?.is_block) return false

    // chặn
    return false
}

/**kiểm tra danh sác page được chọn và user hiện tại có gói hay không */
export const checkPricingValid = (
    proceed: Cb,
    /**sử dụng data page chat thay cho data page thường */
    is_use_chat_data?: boolean,
    /**tắt thông báo */
    disable_alert?: boolean
) => {
    const chatbotUserStore = useChatbotUserStore()
    const pageStore = usePageStore()
    const commonStore = useCommonStore()

    const LIST_SELECTED_PAGE_ID = keys(pageStore.selected_page_id_list)

    const DATA: {
        count_trial_page: number
        /**đếm số trang nội bộ */
        count_internal_page: number
    } = {
        count_trial_page: 0,
        count_internal_page: 0
    }
    waterfall([
        // * kiểm tra xem đã chọn page chưa
        (cb: CbError) => {
            if (!size(pageStore.selected_page_id_list)) return cb(true)

            cb()
        },
        // * kiểm tra các page đã chọn
        (cb: CbError) => eachOfLimit(
            LIST_SELECTED_PAGE_ID,
            1,
            (page_id: string, i, next) => {
                const LIST_PAGE_INFO =
                    is_use_chat_data ?
                        pageStore.selected_page_list_info :
                        pageStore.active_page_list

                const PAGE = LIST_PAGE_INFO[page_id]?.page

                // kiểm tra xem có phải là page dùng thử hay không
                if (
                    PAGE?.end_date_trial &&
                    new Date(PAGE?.end_date_trial).getTime() > new Date().getTime()
                ) {
                    // đếm số lượng các page dùng thử
                    DATA.count_trial_page++
                }

                // đánh dấu số trang nội bộ
                if (PAGE?.is_internal) DATA.count_internal_page++

                // nếu page dược kích hoạt thì cho qua
                if (isActivePage(PAGE)) return next()

                // chặn
                next(true)
            },
            cb
        ),
        // * kiểm tra xem user có gói không
        (cb: CbError) => {
            const USER = chatbotUserStore.chatbot_user

            // nếu tất cả các page được chọn đang là page dùng thử, thì cho qua
            if (DATA.count_trial_page === LIST_SELECTED_PAGE_ID.length)
                return cb()

            // nếu các trang được chọn là nội bộ thì cho qua
            if (DATA.count_internal_page === LIST_SELECTED_PAGE_ID.length)
                return cb()

            // nếu user có gói thì cho qua
            if (isActiveUser(USER)) return cb()

            // chặn
            cb(true)
        },
    ], e => {
        if (e) {
            proceed(e)

            // mở modal báo lỗi gói
            if (!disable_alert) commonStore.triggerRequirePricing()

            return
        }

        proceed()
    })
}