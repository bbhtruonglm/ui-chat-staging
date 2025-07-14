import { Botx } from '@/utils/api/Botx'

/**gọi API lên server của AI */
class Ai extends Botx {
  constructor(path: string) {
    // gọi API lên server của chatbot
    super(`${$env.host.ai}/${path}`)

    // tự động nạp id tổ chức đang chọn
    this.initSelectedOrgId()
  }
}

/**gọi API lên module của app */
class AiApp extends Ai {
  /**id trang */
  readonly #PAGE_ID: string
  /**id khách hàng */
  readonly #CLIENT_ID: string

  constructor(page_id: string, client_id: string, path: string) {
    // gọi API lên module của app
    super(`app/${path}`)

    // lưu lại id trang
    this.#PAGE_ID = page_id
    // lưu lại id khách hàng
    this.#CLIENT_ID = client_id
  }

  /**gọi api post lên AI */
  protected post(path: string, body?: Record<string, any>): Promise<any> {
    return super.post(path, {
      org_id: this.org_id,
      page_id: this.#PAGE_ID,
      client_id: this.#CLIENT_ID,
      ...body,
    })
  }
}

/**dữ liệu của 1 liên hệ */
export interface ContactInfo {
  /**id của liên hệ */
  _id?: string
  /**id của tin nhắn */
  message_id?: string
  /**loại của liên hệ */
  contact_type?: 'PHONE' | 'EMAIL' | 'ADDRESS'
  /**giá trị liên hệ */
  contact_value?: string
  /**nội dung văn bản gốc */
  contact_raw_text?: string
  /**dữ liệu chi tiết hơn nếu có*/
  contact_detail?: Record<string, any>
}

/**gọi API module dữ liệu liên lạc của AI */
export class AiAppContact extends AiApp {
  constructor(page_id: string, client_id: string) {
    // nạp dữ liệu
    super(page_id, client_id, 'contact')
  }

  /**đọc danh sách liên lạc của khách hàng */
  async getContact(body?: BaseQuery): Promise<ContactInfo[]> {
    // gọi api lấy danh sách liên lạc
    return this.post('get_contact', body)
  }
}

/**gọi API cho 1 liên hệ */
export class AiAppOneContact extends AiAppContact {
  /**id của liên hệ */
  protected readonly CONTACT_ID?: string

  constructor(page_id: string, client_id: string, contact_id?: string) {
    // nạp dữ liệu
    super(page_id, client_id)

    // lưu lại id của liên hệ
    this.CONTACT_ID = contact_id
  }

  /**mặc định thêm id liên hệ */
  protected post(path: string, body?: Record<string, any>): Promise<any> {
    return super.post(path, {
      contact_id: this.CONTACT_ID,
      ...body,
    })
  }

  /**tạo mới liên hệ */
  public async createContact(
    contact_type: ContactInfo['contact_type'],
    contact_value: string
  ): Promise<void> {
    // gọi api
    return this.post('create_contact', { contact_type, contact_value })
  }
  /**sửa liên hệ */
  public async updateContact(contact_value: string): Promise<void> {
    // gọi api
    return this.post('update_contact', { contact_value })
  }
  /**xoá liên hệ */
  public async removeContact(): Promise<void> {
    // gọi api
    return this.post('remove_contact')
  }
}
