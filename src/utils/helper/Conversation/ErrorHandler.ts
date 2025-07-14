import { i18n } from "@/lang";

/** xử lý lỗi */
export class ErrorHandler {
  /** xử lý lỗi */
  static parse(e: any, is_raw_error?: boolean): string {
    // nếu lỗi là fail to fetch thì báo lỗi không thể kết nối
    if (typeof e?.message === 'string' && e.message.includes('fetch')) {
      return i18n?.global?.t('Không thể kết nối. Vui lòng thử lại');
    }

    // nếu là raw thì ném ra luôn
    if (is_raw_error) return e
    // nếu có lỗi thì ưu tiên ném ra thông báo lỗi
    return e?.mean || e?.message || e
  }
}