/**tính toán kích thước của ảnh, video để fit với kích thước tối đa */
export class FitSize {
  /**giới hạn độ rộng tối đa */
  readonly #LIMIT_WIDTH: number
  /**giới hạn độ cao tối đa */
  readonly #LIMIT_HEIGHT: number
  /**độ rộng hiện tại */
  readonly #CURRENT_WIDTH: number
  /**độ cao hiện tại */
  readonly #CURRENT_HEIGHT: number

  constructor(
    limit_width: number,
    limit_height: number,
    current_width: number = 1,
    current_height: number = 1
  ) {
    // set giới hạn độ rộng
    this.#LIMIT_WIDTH = limit_width
    // set giới hạn độ cao
    this.#LIMIT_HEIGHT = limit_height
    // set độ rộng hiện tại
    this.#CURRENT_WIDTH = current_width
    // set độ cao hiện tại
    this.#CURRENT_HEIGHT = current_height
  }

  /**tính toán tỉ lệ khung hình */
  #getAspectRatio(): number {
    // lấy tỉ lệ giữa chiều rộng và chiều cao
    return this.#CURRENT_WIDTH / this.#CURRENT_HEIGHT
  }

  /**tạo ra kích thước phù hợp, vẫn giữ nguyên tỉ lệ khung hình */
  public newSize(): { width: number; height: number } {
    /**chiều rộng mới */
    let width = 0
    /**chiều cao mới */
    let height = 0

    /**tỉ lệ khung hình */
    const ASPECT_RATIO = this.#getAspectRatio()
    /**chiều rộng tối đa có thể đạt đến dựa theo tỉ lệ và chiều cao tối đa */
    const NEW_MAX_WIDTH = this.#LIMIT_HEIGHT * ASPECT_RATIO

    // mếu chiều rộng tối đa phù hợp với giới hạn
    if (NEW_MAX_WIDTH <= this.#LIMIT_WIDTH) {
      // Sử dụng chiều rộng tối đa có thể đạt đến
      width = NEW_MAX_WIDTH

      // Sử dụng chiều cao tối đa
      height = this.#LIMIT_HEIGHT

    } 
    // nếu chiều rộng tối đa vượt quá giới hạn
    else {
      // Sử dụng chiều rộng của giới hạn
      width = this.#LIMIT_WIDTH

      // tính chiều cao mới dựa theo chiều rộng mới và tỉ lệ khung hình
      height = this.#LIMIT_WIDTH / ASPECT_RATIO
    }

    // trả về kích thước mới
    return { width, height }
  }

  /**chuyển đổi kích thước mới thành css */
  public toCss(): string {
    // lấy kích thước mới
    const { width: WIDTH, height: HEIGHT } = this.newSize()

    // trả về css
    return `width: ${WIDTH}px; height: ${HEIGHT}px;`
  }
}
