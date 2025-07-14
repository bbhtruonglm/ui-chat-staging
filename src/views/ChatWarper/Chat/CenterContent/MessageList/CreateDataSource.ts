import type {
  MessageInfo,
  MessageTemplateInput,
} from '@/service/interface/app/message'
import { Cdn, type ICdn } from '@/utils/helper/Cdn'
import { container, singleton } from 'tsyringe'

/**chuyển đổi dữ liệu att bình thường thành dạng data source mới */
export interface ICreateDataSource {
  exec(message?: MessageInfo, index?: number): MessageTemplateInput
}

/**chuyển đổi dữ liệu att bình thường thành dạng data source mới */
@singleton()
export class CreateDataSource implements ICreateDataSource {
  /**
   * @param SERVICE_CDN dịch vụ cdn
   */
  constructor(private readonly SERVICE_CDN: ICdn = container.resolve(Cdn)) {}

  exec(message?: MessageInfo, index?: number) {
    // nếu không có index thì trả về object rỗng
    if (index === undefined) return {}

    // trả về dữ liệu mới
    return {
      image: {
        url: this.SERVICE_CDN.fbMessageMedia(
          message?.fb_page_id,
          message?.message_mid,
          index
        ),
      },
      ocr: message?.ai?.[index]?.ocr,
      list_button:
        message?.message_attachments?.[index]?.payload?.elements?.[0]?.buttons,
    }
  }
}
