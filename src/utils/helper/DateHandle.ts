import {
  format as data_format,
  isToday,
  isThisYear,
  formatDistanceToNow,
  formatDistanceStrict,
} from 'date-fns'
import { isDate } from 'lodash'
import { container, singleton } from 'tsyringe'
import viLocale from 'date-fns/locale/vi'
import { Locale, type ILocale } from './Locale'

/**thời gian đầu vào */
export type IDateInput = Date | string | number
/**các hàm hỗ trợ cho ngày tháng */
export interface IDateHandle {
  /**
   * chuyển đổi ngày tháng sang chuỗi theo định dạng
   * @param date dữ liệu ngày tháng
   * @param format định dạng chuỗi
   */
  format(date?: IDateInput, format?: string): string
  /**
   * chuyển đổi ngày tháng sang chuỗi so sánh với ngày hiện tại
   * @param date dữ liệu ngày tháng
   */
  formatCompareCurrentYear(date?: IDateInput): string
  /**
   * tính toán thời gian giữa 2 tin nhắn
   * @param current_date thời gian tin nhắn hiện tại
   * @param next_date thời gian tin nhắn tiếp theo
   */
  calcDuration(current_date: IDateInput, next_date: IDateInput): string
}

/**các hàm hỗ trợ cho ngày tháng */
@singleton()
export class DateHandle implements IDateHandle {
  /**
   * SERVICE_LOCALE dịch vụ locale
   * */
  constructor(
    private readonly SERVICE_LOCALE: ILocale = container.resolve(Locale)
  ) {}

  /**20 phút trước, 2 ngày trước, ... */
  private genAgoDate(date: Date) {
    return formatDistanceToNow(date, {
      includeSeconds: true,
      addSuffix: true,
      locale: viLocale,
    })
      ?.replace('khoảng', '')
      ?.replace('dưới', '')
      ?.replace('nữa', 'trước')
      ?.trim()
  }
  /**chuyển đổi thành đối tượng Date */
  private toDate(date: IDateInput) {
    return isDate(date) ? date : new Date(date)
  }

  format(
    date: IDateInput = new Date(),
    format: string = 'HH:mm:ss dd/MM/yyyy'
  ): string {
    /**dữ liệu ngày tháng */
    const DATE = this.toDate(date)

    return data_format(DATE, format)
  }
  formatCompareCurrentYear(date: IDateInput = new Date()) {
    /**dữ liệu ngày tháng */
    const DATE = this.toDate(date)

    // nếu thời gian trong ngày thì chỉ hiện ago
    if (isToday(DATE)) return this.genAgoDate(DATE)

    // nếu trong năm thì hiện ngày tháng
    if (isThisYear(DATE)) return data_format(DATE, 'dd/MM')

    // nếu khác năm thì hiện full
    return data_format(DATE, 'dd/MM/yy')
  }
  formatShort(date: IDateInput = new Date()) {
    /**dữ liệu ngày tháng */
    const DATE = this.toDate(date)

    // nếu trong năm thì hiện ngày tháng
    if (isThisYear(DATE)) return data_format(DATE, 'HH:mm - dd/MM')

    // nếu khác năm thì hiện full
    return data_format(DATE, 'HH:mm - dd/MM/yyyy')
  }
  calcDuration(
    current_date?: IDateInput,
    next_date?: IDateInput,
    options?: Record<string, any>
  ): string {
    // nếu không có thời gian thì thôi
    if (!current_date || !next_date) return ''

    /**locale hiện tại */
    const LOCALE = this.SERVICE_LOCALE.get()

    // nếu là tiếng việt thì thêm locale
    if (LOCALE === 'vn') options = { locale: viLocale, ...options }

    // trả về thời gian giữa 2 tin nhắn
    return formatDistanceStrict(
      this.toDate(current_date),
      this.toDate(next_date),
      options
    )
  }
}
