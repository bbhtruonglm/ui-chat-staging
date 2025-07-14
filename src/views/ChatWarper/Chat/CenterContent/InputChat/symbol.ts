import type { InjectionKey } from 'vue'

/**kiểm tra nhãn có được kích hoạt cho khách này không */
export const IS_ACTIVE_LABEL_FUNCT = Symbol() as InjectionKey<Function>
/**có hiển thị nút gửi tin không */
export const IS_VISIBLE_SEND_BTN_FUNCT = Symbol() as InjectionKey<Function | undefined>