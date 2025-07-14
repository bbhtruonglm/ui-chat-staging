import type { PageData } from '@/service/interface/app/page'
import type { InjectionKey } from 'vue'

/**hàm sort danh sách page */
export const KEY_SORT_LIST_PAGE_FUNCT = Symbol() as InjectionKey<
  () => PageData[]
>

/**hàm chuyển trang chat */
export const KEY_GO_TO_CHAT_FUNCT = Symbol() as InjectionKey<Function>

/**hàm xử lý nâng cao khi trang được chọn */
export const KEY_ADVANCE_SELECT_AGE_FUNCT = Symbol() as InjectionKey<
  (page: PageData) => void
>
