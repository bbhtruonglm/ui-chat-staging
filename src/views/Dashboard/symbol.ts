import type { InjectionKey } from 'vue'

/**đọc lại dữ liệu user hiện tại */
export const KEY_GET_CHATBOT_USER_FUNCT = Symbol() as InjectionKey<Function>

/**toggle modal kết nối trang */
export const KEY_TOGGLE_MODAL_CONNECT_PAGE_FUNCT =
  Symbol() as InjectionKey<Function>

/**toggle modal tiềnkết nối trang */
export const KEY_TOGGLE_DROPDOWN_PICK_CONNECT_PLATFORM =
  Symbol() as InjectionKey<Function | undefined>

/**nạp lại dữ liệu trang */
export const KEY_RELOAD_PAGE_DATA = Symbol() as InjectionKey<
  Function | undefined
>

/**hàm lấy danh sách trang của 1 tổ chức */
export const KEY_GET_ORG_PAGES_FN = Symbol() as InjectionKey<Function>

/**hàm lấy toàn bộ tổ chức + toàn bộ trang */
export const KEY_GET_ALL_ORG_AND_PAGE_FN = Symbol() as InjectionKey<Function>
