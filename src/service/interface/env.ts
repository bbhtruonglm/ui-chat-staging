/**các cài đặt cho một môi trường */
export interface Env {
    /**cài đặt cho local */
    local_storage: {
        /**prefix cho tên của local */
        prefix: string
    }
    /**danh sách các domain của api */
    host: {
        n3_socket: string
        n4_service_v1: string
        n4_service_v2: string
        n5_app_v1: string
        n5_app_v2: string
        n6_static: string
        /**api quản lý analytic v2 */
        n9_analytic_v2: string
        /**api quản lý tổ chức */
        billing: string
        /**quản lý ai */
        ai: string
        /**quản lý chatbot */
        chatbot: string
        n8_merge: string
        widget: string
        page_setting_view: string
        analytic_view: string
        chatbot_view: string
        download_client: string
    }
    /**cài đặt cho riêng facebook */
    facebook: {
        /**id của app facebook */
        app_id: string
        permissions: string[]
        /**các tuỳ chọn khi đăng nhập */
        login_option: {
            return_scopes?: boolean
            auth_type?: string
            enable_profile_selector?: boolean
        }
        /**cài đặt cho facebook v2 */
        v2: {
            /**id của app facebook */
            app_id: string
            /**cài đặt cho instagram */
            instagram: {
                /**đường dẫn khi redirect */
                redirect_uri: string
                /**các quyền của instagram */
                scoped: string[]
            }
        }
    }
    /**cài đặt cho zalo oa */
    zalo_oa: {
        /**callback url sau khi oauth */
        redirect_uri: string
    },
    /**danh sách các nền tảng được kết nối với hệ thống chatobox */
    platform: string[]
    /**host của url link ảnh */
    img_host: string
    /**AI */
    ai: {
        /**các widet trigger từ AI */
        widget: {
            /**tạo đơn hàng */
            place_order: string
            /**tạo giao dịch */
            create_transaction: string
            /**đặt lịch */
            schedule_appointment: string
        }
    }
}