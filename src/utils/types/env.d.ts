import type { IExternalLink } from '../api/N4Service/Partner'

declare global {
  /**các cài đặt cho một môi trường */
  export interface IEnv {
    /**cài đặt cho local */
    local_storage: {
      /**prefix cho tên của local */
      prefix: string
    },
    /**cài đặt cho session */
    session_storage: {
      /**prefix cho tên của session */
      prefix: 'chatbox_',
    },
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
      /**api quản lý n8 merge v2 */
      n8_merge_v2: string
      /**host của cdn tập tin */
      media_cdn: string
      /**api quản lý zalo cá nhân */
      n13_zalo_personal: string
      /**socket lắng nghe mã qr số 2 */
      n13_zalo_personal_socket: string
      /**link thiết lập trợ lý ảo cho tổ chức */
      agent_config: string
      /**hệ thống merchant */
      merchant: {
        /**liên hệ */
        contact: string
      }
    }
    external_link: IExternalLink
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
      /**callback url trung gian */
      portal: string
    }
    /**cài đặt cho IG */
    instagram: {
      /**đường dẫn chuyển hướng */
      redirect_uri: string
      /**id ứng dụng riêng của IG */
      app_id: string
      /**các quyền của IG */
      scope: string[]
    }
    /**danh sách các nền tảng được kết nối với hệ thống chatobox */
    platform: IPageType[]
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
}
