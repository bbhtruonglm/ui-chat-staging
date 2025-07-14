import { useCommonStore } from '@/stores'
import { useOAuthStore } from '@/views/OAuth/store'
import { N4SerivcePublicOauthFacebok } from '@/utils/api/N4Service/Oauth'
import { error } from '@/utils/decorator/Error'
import { loadingV2 } from '@/utils/decorator/Loading'
import { Toast } from '@/utils/helper/Alert/Toast'
import { LocalStorage, type ILocalStorage } from '@/utils/helper/LocalStorage'
import { container, singleton } from 'tsyringe'
import { useI18n } from 'vue-i18n'
import { useRouter, type RouteLocationRaw } from 'vue-router'

import type { IAlert } from '@/utils/helper/Alert/type'

/**các hàm composable của OAuth */
export function composableService() {
  const commonStore = useCommonStore()
  const oAuthStore = useOAuthStore()
  const $router = useRouter()
  const { t: $t } = useI18n()

  /**class xử lý đăng nhập */
  @singleton()
  class ServiceOAuth {
    /**
     * @param API_OAUTH_FB API đăng nhập
     * @param SERVICE_LOCAL_STORAGE service quản lý local storage
     */
    constructor(
      private readonly API_OAUTH_FB = container.resolve(
        N4SerivcePublicOauthFacebok
      ),
      private readonly SERVICE_LOCAL_STORAGE: ILocalStorage = container.resolve(
        LocalStorage
      )
    ) {}

    /**đăng nhập chatbox bằng token fb */
    @loadingV2(commonStore, 'is_loading_full_screen')
    @error()
    async loginFb(access_token: string) {
      /**jwt đại diện cho người dùng */
      const { access_token: JWT } = await this.API_OAUTH_FB.login(
        access_token,
        this.SERVICE_LOCAL_STORAGE.getItem('ref')
      )

      // lưu token vào local storage
      this.SERVICE_LOCAL_STORAGE.setItem('access_token', JWT)

      // chuyển hướng vào dashboard
      this.redirect('/dashboard')
    }
    /**chuyển hướng */
    redirect(to: RouteLocationRaw) {
      // xóa thông báo lỗi trước khi
      oAuthStore.error_message = undefined

      // chuyển hướng đến trang khác
      $router.push(to)
    }
  }

  /**hàm xử lý lỗi đặc biệt */
  function customError(message?: string): string | undefined {
    // nếu lỗi là không có quyền truy cập thì thông báo khác
    if (message === 'COMMON.ACCESS_DENIED')
      return $t('Tài khoản hoặc mật khẩu không đúng')

    // nếu lỗi là email chưa xác thực thì thông báo khác
    if (message === 'COMMON.EMAIL_NOT_VERIFY')
      return $t('Tài khoản chưa được xác thực')

    // nếu lỗi là tài khoản không tồn tại thì thông báo khác
    if (message === 'COMMON.USER_NOT_FOUND')
      return $t('Tài khoản không tồn tại')

    // người dùng đã xác thực rồi
    if (message === 'COMMON.USER_IS_VERIFY') return $t('Tài khoản đã xác thực')

    // sai mã xác thực
    if (message === 'COMMON.INVALID.VERIFY_CODE')
      return $t('Mã xác thực không đúng')

    // email đã tồn tại
    if (message === 'COMMON.EMAIL_EXISTED') return $t('Email đã tồn tại')
  }

  /**decorator xử lý loading của oauth */
  const handleLoadingOauth = loadingV2(commonStore, 'is_loading_full_screen')

  /**toast thông báo */
  @singleton()
  class CustomToast extends Toast implements IAlert {
    public error(message: any): void {
      /**lỗi tùy chỉnh */
      const CUSTOM_ERROR = customError(message?.message)

      // nếu có lỗi custom thì không hiện toast
      if (CUSTOM_ERROR) {
        // hiện lỗi tùy chỉnh nếu có
        oAuthStore.error_message = CUSTOM_ERROR

        return
      }

      // thông báo lỗi
      super.error(message?.message || message)
    }
  }
  /**decorator xử lý lỗi của oauth */
  const handleErrorOauth = (callback?: Function) =>
    error(container.resolve(CustomToast), callback)

  /**đường dẫn điều khoản */
  const TERM = 'https://retion.ai/tos.html'
  /**đường dẫn bảo mật */
  const PRIVACY = 'https://retion.ai/privacy.html'

  // trả về các hàm
  return {
    ServiceOAuth,
    customError,
    handleLoadingOauth,
    handleErrorOauth,
    TERM,
    PRIVACY,
  }
}
