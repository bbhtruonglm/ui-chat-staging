import { get, set } from 'lodash'
import type { Store } from 'pinia'
import type { Ref } from 'vue'

/**
 * hàm trang trí tính năng loading cho phương thức
 * @param is_loading ref của biến để bật tắt loading
 * @param is_block_if_loading có chặn hành động khi đang loading hay không
 * @deprecated dùng loadingV2 thay thế
 */
export function loading(
  is_loading: Ref<boolean | undefined | null>,
  is_block_if_loading = true
) {
  return function (
    target: any,
    property_key: string,
    descriptor: PropertyDescriptor
  ) {
    /**phương thức gốc */
    const ORIGINAL_METHOD = descriptor.value

    // trang trí phương thức
    descriptor.value = async function (...args: any[]) {
      // nếu bật chặn khi đang loading
      if (is_block_if_loading && is_loading.value) return

      // thử chạy phương thức
      try {
        // bật loading
        is_loading.value = true

        // chạy phương thức gốc
        await ORIGINAL_METHOD.apply(this, args)
      } finally {
        // sau khi chạy xong thì tắt loading (lỗi hoặc thành công)
        is_loading.value = false
      }
    }

    // trả về phương thức đã trang trí
    return descriptor
  }
}

/**
 * hàm trang trí tính năng loading cho phương thức
 * @param loading_holder store hoặc ref chứa biến loading
 * @param loading_path đường dẫn của biến loading
 * @param is_block_if_loading có chặn hành động khi đang loading hay không
 */
export function loadingV2(
  loading_holder: Ref | Store,
  loading_path: string,
  is_block_if_loading = true
) {
  return function (
    target: any,
    property_key: string,
    descriptor: PropertyDescriptor
  ) {
    /**phương thức gốc */
    const ORIGINAL_METHOD = descriptor.value

    // trang trí phương thức
    descriptor.value = async function (...args: any[]) {
      // nếu bật chặn khi đang loading -> chặn kích hoạt cho đến khi tắt loading
      if (is_block_if_loading && get(loading_holder, loading_path)) return

      // thử chạy phương thức
      try {
        // bật loading
        set(loading_holder, loading_path, true)

        // chạy phương thức gốc
        await ORIGINAL_METHOD.apply(this, args)
      } finally {
        // sau khi chạy xong thì tắt loading (lỗi hoặc thành công)
        set(loading_holder, loading_path, false)
      }
    }

    // trả về phương thức đã trang trí
    return descriptor
  }
}
