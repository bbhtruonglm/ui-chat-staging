import { nextTick } from 'vue'
import { singleton } from 'tsyringe'
import { map } from 'lodash'

/**interface đếm số lượng item bị ẩn */
export interface ICounHiddenItem {
  /**
   * thực thi
   * @param children_query_selector query selector của các item cần đếm
   * @param node_warper node bao ngoài
   */
  exec(
    children_query_selector: string,
    node_warper?: HTMLElement
  ): Promise<number | undefined>
}

/**đếm số lượng item bị ẩn */
@singleton()
export class CountHiddenItem implements ICounHiddenItem {
  async exec(children_query_selector: string, node_warper?: HTMLElement) {
    // nếu không có div bao ngoài thì thôi
    if (!node_warper) return

    /**số item bị ẩn */
    let total_over = 0

    /**khoảng cách giữa các item */
    const GAP = parseFloat(
      window.getComputedStyle(node_warper).getPropertyValue('gap')
    )

    /**độ rộng của div bao ngoài */
    const CONTAINER_WIDTH = node_warper?.clientWidth || 0

    // chờ vue render xong mới thực hiện
    await nextTick()

    // lấy toàn bộ các div item bên trong div bao ngoài
    const DIV_LABELS = node_warper?.querySelectorAll(children_query_selector)

    /**tổng độ rộng của các div item */
    let total_width = 0

    // lặp qua từng div item, lấy width của nó
    map(DIV_LABELS, div => {
      /**độ rộng của div tính cả gap */
      const LABEL_WIDTH = div.clientWidth + GAP

      // cộng dồn vào tổng độ rộng
      total_width += LABEL_WIDTH

      // nếu vượt thì tăng số item bị ẩn
      if (total_width > CONTAINER_WIDTH) total_over++
    })

    // trả về số item bị ẩn
    return total_over
  }
}
