import { Botx } from '@/utils/api/Botx'

/**gọi API lên server của chatbot */
class Chatbot extends Botx {
  constructor(path: string) {
    // gọi API lên server của chatbot
    super(`${$env.host.chatbot}/${path}`)

    // tự động nạp id tổ chức đang chọn
    this.initSelectedOrgId()
  }
}

/**gọi API lên module của app */
class ChatbotApp extends Chatbot {
  /**id trang */
  readonly #PAGE_ID: string

  constructor(page_id: string, path: string) {
    // gọi API lên module của app
    super(`app/${path}`)

    // lưu lại id trang
    this.#PAGE_ID = page_id
  }

  /**gọi api post lên app chatbot */
  protected post(path: string, body?: Record<string, any>): Promise<any> {
    return super.post(path, {
      org_id: this.org_id,
      page_id: this.#PAGE_ID,
      ...body,
    })
  }
}

/**gọi API module page của chatbot */
export class ChatbotAppPage extends ChatbotApp {
  constructor(page_id: string) {
    // gọi API module page của chatbot
    super(page_id, `page/`)
  }

  /**cập nhật thiết lập của trang */
  async #upsertPage(body: Record<string, any>): Promise<void> {
    // gọi api cập nhật trang
    return this.post('upsert_page', body)
  }

  /**kích hoạt | huỷ kích hoạt chatbot */
  async activePage(value: boolean): Promise<void> {
    // gọi phương thức cập nhật trang
    return this.#upsertPage({ page_is_active: value })
  }
}

/**dữ liệu của một thuộc tính tuỳ biến */
export type AttributeValueType = string | number | boolean
/**dữ liệu của 1 khách hàng */
export interface ClientInfo {
  /**id của khách hàng  */
  client_id?: string
  // id của trang sở hữu khách hàng này
  page_id?: string
  /**khách hàng đến từ nền tảng nào */
  client_platform_type?: 'FACEBOOK'
  /**tên khách hàng */
  client_first_name?: string
  /**tên khách hàng */
  client_last_name?: string
  /**giới tính của khách hàng */
  client_gender?: 'MALE' | 'FEMALE' | 'OTHER'
  /**thuộc tính tuỳ biến */
  client_attribute?: {
    [index: string]: AttributeValueType
  }
  /**danh sách id các chuỗi gắn cho khách này */
  client_list_sequence_id?: [string]
  /**gắn cờ dừng chatbot với khách hàng này */
  client_is_stop?: boolean
}

/**gọi API module client của chatbot */
export class ChatbotAppClient extends ChatbotApp {
  /**id khách hàng */
  readonly #CLIENT_ID: string

  constructor(page_id: string, client_id: string) {
    // gọi API module page của chatbot
    super(page_id, 'client')

    // lưu lại id khách hàng
    this.#CLIENT_ID = client_id
  }

  /**thêm id khách hàng mặc định */
  protected post(path: string, body?: Record<string, any>): Promise<any> {
    return super.post(path, { client_id: this.#CLIENT_ID, ...body })
  }

  /**đọc đữ liệu khách hàng */
  public async readClient(): Promise<ClientInfo> {
    /**dữ liệu từ server */
    const RES = (await this.post('read_client')) as ClientInfo[]

    // trả về dữ liệu khách hàng
    return RES?.[0]
  }
  /**tắt bật chatbot của người dùng này */
  public async toggleClient(is_stop: boolean): Promise<void> {
    // gọi api
    await this.post('toggle_client', { is_stop })
  }
  /**sửa thuộc tính tuỳ biến của người dùng này */
  public async editAttribute(
    list_attribute: Record<string, any>
  ): Promise<void> {
    // gọi api
    await this.post('edit_attribute', { list_attribute })
  }
}
