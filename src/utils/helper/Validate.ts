import isEmail from 'validator/lib/isEmail'
import { addMethod, string } from 'yup'

// khai báo thêm phương thức
declare module 'yup' {
  interface StringSchema {
    /**kiểm tra không chứa khoảng trắng */
    noWhitespace(message?: string): this
  }
}

// thêm phương thức kiểm tra không chứa khoảng trắng
addMethod(string, 'noWhitespace', function (message) {
  // trả về thông báo lỗi nếu giá trị chứa khoảng trắng
  return this.test('no-whitespace', message, function (value) {
    // lấy đường dẫn và thông báo lỗi
    const { path: PATH, createError } = this

    /**kiểm tra giá trị không được toàn là khoảng trắng */
    const CHECK_NO_WHITESPACE = !/^\s*$/.test(value || '')

    /**kiểm tra giá trị không chứa khoảng trắng ở hai đầu */
    const CHECK_NO_WHITESPACE_AT_EDGES = value === value?.trim()

    /**kiểm tra tổng */
    const CHECK_TOTAL = CHECK_NO_WHITESPACE && CHECK_NO_WHITESPACE_AT_EDGES

    /**lỗi được tạo */
    const ERROR = createError({
      path: PATH,
      message: message || 'This field cannot contain only whitespace',
    })

    // trả về kết quả
    return CHECK_TOTAL || ERROR
  })
})

// sửa phương thức kiểm tra email của yup không chuẩn
addMethod(string, 'email', function (message) {
  // trả về thông báo lỗi nếu giá trị chứa khoảng trắng
  return this.test('email', message, function (value) {
    // lấy đường dẫn và thông báo lỗi
    const { path: PATH, createError } = this

    /**lỗi được tạo */
    const ERROR = createError({
      path: PATH,
      message: message || 'Email is not valid',
    })

    // trả về kết quả
    return isEmail(value || '') || ERROR
  })
})
