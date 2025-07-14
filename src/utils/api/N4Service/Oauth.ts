import { N4Serivce } from '@/utils/api/N4Serivce'
import { singleton } from 'tsyringe'

/**kết quả đăng nhập */
export interface LoginRes {
  /**id người dùng mới nhất */
  user_id?: string
  /**AS_ID của fb */
  fb_staff_id?: string
  /**id gốc của mongo */
  _id?: string
  /**jwt để truy cập */
  access_token?: string
}

/**gọi API xác thực truy cập */
export class N4SerivcePublicOauth extends N4Serivce {
  constructor(path: string) {
    // gọi API module xác thực
    super(`public/oauth/${path}`)
  }
}

/**gọi API xác thực truy cập của FB */
@singleton()
export class N4SerivcePublicOauthFacebok extends N4SerivcePublicOauth {
  constructor() {
    // gọi API module xác thực của FB
    super('facebook')
  }

  /**api đăng nhâp */
  public async login(access_token: string, ref?: string): Promise<LoginRes> {
    // gọi api
    return this.post('login', { access_token, ref })
  }
}
/**gọi API xác thực truy cập email */
@singleton()
export class N4SerivcePublicOauthBasic extends N4SerivcePublicOauth {
  constructor() {
    // gọi API module xác thực của FB
    super('basic')
  }

  /**api đăng nhâp */
  public async login(email: string, password: string): Promise<LoginRes> {
    // gọi api
    return this.post('login', { email, password }, true)
  }
  /**api đăng ký */
  public async register(
    email: string,
    password: string,
    full_name: string,
    first_name: string,
    last_name: string,
    ref?: string
  ): Promise<LoginRes> {
    // gọi api
    return this.post(
      'register',
      {
        email,
        password,
        full_name,
        first_name,
        last_name,
        ref,
      },
      true
    )
  }
  /**api gửi lại mã xác thực */
  public async resendVerifyEmail(email: string): Promise<LoginRes> {
    // gọi api
    return this.post('resend_verify_email', { email }, true)
  }
  /**xác thực tài khoản email */
  public async verifyEmail(email: string, verify_code: string): Promise<void> {
    // gọi api
    return this.post('verify_email', { email, verify_code }, true)
  }
  /**kiểm tra email chưa tạo tài khoản */
  public async checkEmail(email: string): Promise<void> {
    // gọi api
    return this.post('check_email', { email }, true)
  }
  /**gửi mail reset mật khẩu */
  public async forgotPassword(email: string): Promise<void> {
    // gọi api
    return this.post('forgot_password', { email }, true)
  }
  /**đặt lại mật khẩu */
  public async ressetPassword(
    email: string,
    password: string,
    verify_code: string
  ): Promise<void> {
    // gọi api
    return this.post('reset_password', { email, password, verify_code }, true)
  }
}
