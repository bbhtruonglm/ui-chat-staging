import { ApiManager } from '@/utils/base/Api'

/**lịch sử cuộc gọi */
/** Dạng lịch sử cuộc gọi */
export enum CallHistoryType {
  /** Cuộc gọi đi */
  OUTGOING = 'OUTGOING',
  /** Cuộc gọi đến */
  INCOMING = 'INCOMING',
}

/** Trạng thái cuộc gọi */
export enum CallStatus {
  /** Máy bận */
  BUSY = 'BUSY',
  /** Đã kết thúc */
  ENDED = 'ENDED',
  /** Đã hủy */
  CANCELED = 'CANCELED',
  /** Đã trả lời */
  ANSWERED = 'ANSWERED',
  /** Không trả lời */
  NO_ANSWER = 'NO_ANSWER',
}

/** Lịch sử cuộc gọi */

export interface ICallHistory {

  /** ID bản ghi dạng UUID */
  id?: string;

  /** ID cuộc gọi (Do bên thứ 3 cung cấp) */
  call_id?: string;

  /** Dạng lịch sử cuộc gọi */
  call_type?: keyof typeof CallHistoryType;

  /** Trạng thái cuộc gọi */
  call_status?: keyof typeof CallStatus;

  /** ID contact */
  contact_id?: string | null;

  /** Số điện thoại gọi đi */
  phone?: string;

  /** Thời gian bắt đầu cuộc gọi */
  start_time?: Date;

  /** Thời gian kết thúc cuộc gọi */
  end_time?: Date;

  /** Thời lượng cuộc gọi (tính bằng giây) */
  duration?: number;

  /** Thời gian tạo record */
  createdAt?: Date;

  /** Thời gian cập nhật record */
  updatedAt?: Date;
}

/**gọi API lên server của merchant */
export class MerchantContact extends ApiManager {
  constructor() {
    super($env.host.merchant.contact)
  }

  /**
   * đọc lịch sử cuộc gọi
   * @param org_id id tổ chức
   * @param page_id id trang
   * @param client_id id khách hàng
   */
  async getCallHistory(
    org_id: string,
    page_id: string,
    client_id: string
  ): Promise<ICallHistory[]> {
    /**dữ liệu gốc */
    return await this.post('customer/call_history', {
      org_id,
      page_id,
      client_id,
    })
  }
}

/**
  const RES = await new MerchantContact().getCallHistory(
    '7bd3ac17116c4aacb2e9e55ba0330388',
    '414786618395170',
    '8354158424709905'
  )
  console.log('res', RES)
 */
