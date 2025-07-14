import { singleton } from 'tsyringe'

/**callback sau khi upload file */
export type UploadFileCallback = (files?: FileList | null) => void
/**upload file từ thiết bị */
export interface IUploadFile {
  /**
   * thực thi
   * @param callback callback sau khi upload file
   * @param is_multiple có cho phép chọn nhiều file không
   * @param accept lọc các file được upload
   */
  exec(
    callback: UploadFileCallback,
    is_multiple?: boolean,
    accept?: string
  ): void
}

/**upload file từ thiết bị */
@singleton()
export class UploadFile implements IUploadFile {
  /**xóa input khỏi DOM */
  private removeInput(input?: HTMLInputElement) {
    // xoá input khỏi DOM
    input?.parentNode?.removeChild?.(input)
  }

  exec(callback: UploadFileCallback, is_multiple?: boolean, accept?: string) {
    /**thẻ input dùng để upload file */
    const INPUT = document.createElement('input')

    // cho phép upload
    INPUT.type = 'file'
    // thiết lập số lượng file
    INPUT.multiple = !!is_multiple
    // lọc các file được upload
    if (accept) INPUT.accept = accept
    // không hiển thị input trên UI
    INPUT.style.display = 'none'

    // xóa input khi bị hủy chọn
    INPUT.onabort = () => this.removeInput(INPUT)

    // hàm xử lý sau khi chọn file
    INPUT.onchange = () => {
      // xuất files ra ngoài
      callback(INPUT.files)

      // xoá input sau khi xong việc
      this.removeInput(INPUT)
    }

    // thêm input vào html
    document.body.appendChild(INPUT)

    // click vào input
    INPUT.click()
  }
}
