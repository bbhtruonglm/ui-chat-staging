import { useI18n } from 'vue-i18n'
import { object, string } from 'yup'

/**xác thực dữ liệu */
export function composableValidate() {
  const { t: $t } = useI18n()

  /**email */
  const EMAIL = $t('Email')
  /**tên */
  const FIRST_NAME = $t('Tên')
  /**họ */
  const LAST_NAME = $t('Họ')
  /**mật khẩu */
  const PASSWORD = $t('Mật khẩu')
  /**xác nhận mật khẩu */
  const CONFIRM_PASSWORD = $t('Xác nhận mật khẩu')

  /**xác thực email */
  const VLD_EMAIL = object({
    email: string()
      .required($t('Bạn chưa nhập _', { name: EMAIL }))
      .noWhitespace($t('_ không hợp lệ', { name: EMAIL }))
      .email($t('_ không hợp lệ', { name: EMAIL })),
  })

  /**xác thực email + password */
  const VLD_EMAIL_PASSWORD = object({
    password: string()
      .required($t('Bạn chưa nhập _', { name: PASSWORD }))
      .noWhitespace($t('_ không hợp lệ', { name: PASSWORD })),

    ...VLD_EMAIL.fields,
  })

  /**xác thực email + password + confirm password */
  const VLD_EMAIL_PASSWORD_AND_CONFIRM = object({
    confirm_password: string()
      .required($t('Bạn chưa nhập _', { name: CONFIRM_PASSWORD }))
      .noWhitespace($t('_ không hợp lệ', { name: CONFIRM_PASSWORD })),

    ...VLD_EMAIL_PASSWORD.fields,
  })

  /**xác thực khi tạo tài khoản bằng email */
  const VLD_EMAIL_REGISTER = object({
    first_name: string()
      .required($t('Bạn chưa nhập _', { name: FIRST_NAME }))
      .noWhitespace($t('_ không hợp lệ', { name: FIRST_NAME })),

    last_name: string()
      .required($t('Bạn chưa nhập _', { name: LAST_NAME }))
      .noWhitespace($t('_ không hợp lệ', { name: LAST_NAME })),

    ...VLD_EMAIL_PASSWORD_AND_CONFIRM.fields,
  })

  // trả về kết quả
  return {
    VLD_EMAIL,
    VLD_EMAIL_PASSWORD,
    VLD_EMAIL_REGISTER,
    VLD_EMAIL_PASSWORD_AND_CONFIRM,
  }
}
