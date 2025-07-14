import { Botx } from '@/utils/api/Botx'

/**gọi API lên server n9 v2 của chatbox */
class N9Analytic extends Botx {
  constructor(path: string) {
    // gọi API lên server của chatbox
    super(`${$env.host.n9_analytic_v2}/${path}`)

    // tự động nạp id tổ chức đang chọn
    this.initSelectedOrgId()
  }
}

/**gọi API lên module của app */
class N9AnalyticApp extends N9Analytic {
  /**id trang */
  readonly #PAGE_ID: string

  constructor(page_id: string, path: string) {
    // gọi API lên module của app
    super(`app/${path}`)

    // lưu lại id trang
    this.#PAGE_ID = page_id
  }

  /**gọi api post lên app n9 */
  protected post(path: string, body?: Record<string, any>): Promise<any> {
    return super.post(path, {
      org_id: [this.org_id],
      page_id: [this.#PAGE_ID],
      ...body,
    })
  }
}

/**dữ liệu gốc của một sự kiện thống kê */
interface EventInfoRaw {
  /**tên sự kiện */
  event?: string
  /**giá trị */
  value?: string
  /**dữ liệu thêm */
  data?: string
  /**thời gian */
  timestamp?: string
}
/**dữ liệu thống kê đã xử lý */
export interface EventInfo {
  /**tên sự kiện */
  event?: string
  /**giá trị */
  value?: string
  /**dữ liệu thêm */
  data?: Record<string, any>
  /**thời gian */
  timestamp?: Date
}

/**gọi API thống kê */
export class N9AnalyticAppAnalytic extends N9AnalyticApp {
  /**id khách hàng */
  protected readonly CLIENT_ID?: string

  constructor(page_id: string, client_id?: string) {
    // gọi lớp cha
    super(page_id, `analytic`)

    // lưu lại id khách hàng
    this.CLIENT_ID = client_id
  }

  /**thêm tự động id khách hàng */
  protected post(path: string, body?: Record<string, any>): Promise<any> {
    return super.post(path, { client_id: [this.CLIENT_ID], ...body })
  }

  /**đọc dữ liệu thống kê gốc */
  async readEvent(
    event: string[],
    skip: number,
    limit: number
  ): Promise<EventInfo[]> {
    /**dữ liệu gốc */
    const RES = (await this.post('read_event', {
      skip,
      limit,
      event,
    })) as EventInfoRaw[]

    // chuyển dữ liệu gốc sang dữ liệu đã xử lý
    return RES.map(event => {
      /**dữ liệu đã xử lý */
      let data: Record<string, any> = {}

      // chuyển dữ liệu từ string sang object
      try {
        data = JSON.parse(event.data || '{}')
      } catch (e) {}

      // trả về dữ liệu đã xử lý
      return {
        event: event.event,
        value: event.value,
        data,
        timestamp: new Date(event.timestamp || ''),
      }
    })
  }
}
