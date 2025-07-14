import { Botx } from '@/utils/api/Botx'

// ================================ N6Static ================================ //

// ---------------------------------- CLASS ---------------------------------- //
/**gọi API lên server n6 của chatbox */
export class N6Static extends Botx {
  /**id trang */
  readonly #PAGE_ID: string

  constructor(path: string, page_id: string) {
    // gọi API lên server của chatbox
    super(`${$env.host.n6_static}/${path}`)

    // lưu lại id trang
    this.#PAGE_ID = page_id

    // tự động nạp id tổ chức đang chọn
    this.initSelectedOrgId()
  }

  /**đính kèm dữ liệu mặc định lên toàn bộ API post */
  protected post(path: string, body?: Record<string, any>): Promise<any> {
    return super.post(path, {
      page_id: this.#PAGE_ID,
      org_id: this.org_id,
      ...body,
    })
  }
  /**đính kèm dữ liệu mặc định lên toàn bộ API upload */
  protected upload(
    path: string,
    qs?: Record<string, any>,
    body?: FormData
  ): Promise<any> {
    return super.upload(
      path,
      {
        page_id: this.#PAGE_ID,
        org_id: this.org_id,
        ...qs,
      },
      body
    )
  }
}

// ========================== N6StaticAppUploadFile ========================== //

// -------------------------------- INTERFACE -------------------------------- //
/**loại lưu trữ */
export type Uploadtype = 'TEMP' | 'FULL' | 'ZALO_FILE'
/**kết quả upload file */
interface UploadRes {
  /**link của file */
  url?: string
  /**loại file */
  type?: string
}

// ---------------------------------- CLASS ---------------------------------- //
/**gọi API module conversation của chatbox */
export class N6StaticAppUploadFile extends N6Static {
  constructor(page_id: string) {
    // gọi API module upload
    super('app/upload/file', page_id)
  }

  /**
   * tải file lên hệ thống
   * - file tạm
   * - file vĩnh viễn
   * - file của zalo-oa
   * @param type loại lưu trữ
   * @param form dữ liệu upload
   */
  async uploadTempFile(
    type: Uploadtype = 'TEMP',
    file: File
  ): Promise<UploadRes> {
    /**đối tượng form */
    const FORM = new FormData()

    // tải file lên hệ thống
    FORM.append('file', file)

    /**kết quả upload */
    const RES = await this.upload('upload_temp_file', { type }, FORM)

    // nếu kết quả là chuỗi
    if (typeof RES === 'string') return { url: RES }
    // nếu là các dạng còn lại
    else return RES
  }
}
