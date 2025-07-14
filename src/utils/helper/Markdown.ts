// src/services/markdown.service.ts

/**
 * Định nghĩa giao diện cho dịch vụ Markdown.
 * Giúp dễ dàng thay thế thư viện Markdown sau này.
 */
export interface IMarkdownService {
  /**
   * Chuyển chuỗi Markdown thành HTML.
   * @param markdown Nội dung Markdown
   * @returns HTML
   */
  render(markdown: string): string
}

// Adapter sử dụng thư viện marked
import { marked, type Tokens } from 'marked'
import { singleton } from 'tsyringe'

/**
 * Cài đặt dịch vụ Markdown sử dụng marked.
 */
@singleton()
export class MarkedService implements IMarkdownService {
  constructor() {
    this.setupMarked()
  }

  /**
   * Khởi tạo cấu hình cho marked (renderer, walkTokens,...)
   */
  private setupMarked() {
    /** Override image renderer để thêm lazy-load */
    const RENDERER = {
      image(token: Tokens.Image) {
        return `<img src="${token.href}" alt="${token.text}" loading="lazy">`
      },
      link(token: Tokens.Link) {
        /** Link gốc */
        const SAFE_HREF = token.href ?? '#'

        /** Thêm title cho link */
        const TITLE_ATTR = token.title ? ` title="${token.title}"` : ''

        // tạo thẻ a với target là _blank để mở sang tab mới khi nhấn
        return `<a href="${SAFE_HREF}" target="_blank" rel="noopener noreferrer"${TITLE_ATTR}>${token.text}</a>`
      },
    }

    // Sử dụng walkTokens để bỏ parse mail thành link
    marked.use({
      renderer: RENDERER,
      walkTokens(token) {
        if (token.type === 'link' && token.href.startsWith('mailto:')) {
          token.type = 'text'
          token.raw = token.text
        }
      },
      async: false,
    })

    // Thiết lập xuống dòng khi có \n
    marked.setOptions({
      breaks: true,
    })
  }

  /**
   * Render Markdown
   */
  render(markdown: string): string {
    return marked(markdown) as string
  }
}
