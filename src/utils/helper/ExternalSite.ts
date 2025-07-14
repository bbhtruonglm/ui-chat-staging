import { container, singleton } from 'tsyringe'
import { WindowAction, type IWindowAction } from './Navigation'
import {
  useChatbotUserStore,
  useCommonStore,
  useConversationStore,
  useOrgStore,
  usePageStore,
} from '@/stores'
import { Parser, type IParser } from './Parser'
import { LocalStorage, type ILocalStorage } from './LocalStorage'
import { Locale, type ILocale } from './Locale'
import { NotFoundError } from '../error/NotFound'
import { keys, values } from 'lodash'
import type { IExternalLink } from '../api/N4Service/Partner'

/**các tiện ích liên quan đến trang web bên ngoài */
export interface IExternalSite {
  /**
   * mở thiết lập trang
   * @param path loại thiết lập trang
   */
  openPageSetting(path?: string): void
  /**
   * mở trang thống kê
   * @param path loại thống kê
   */
  openPageAnalytic(path?: string): void
  /**
   * mở trang thiết lập chatbot
   * @param path loại thiết lập chatbot
   */
  openPageChatbot(path?: string): void
  /**
   * mở merchant.vn
   * @param path đường dẫn cụ thể
   * @param redirect đường dẫn chuyển hướng sau khi đăng nhập
   */
  openMerchant(path?: string, redirect?: string): void
  /**
   * mở trang thiết lập hệ thống
   * @param path đường dẫn cụ thể
   */
  openSystemDashboard(path?: string): void
}

/**các tiện ích liên quan đến trang web bên ngoài */
@singleton()
export class ExternalSite implements IExternalSite {
  /**
   * @param STORE_CONVERSATION store dữ liệu cuộc trò chuyện
   * @param STORE_ORG store dữ liệu tổ chức
   * @param STORE_PAGE store dữ liệu trang
   * @param STORE_CHATBOT_USER store dữ liệu người dùng chatbot
   * @param SERVICE_WINDOW_ACTION các tiện ích liên quan đến cửa sổ trình duyệt
   * @param SERVICE_PARSER các tiện ích liên quan đến xử lý dữ liệu
   * @param SERVICE_LOCALSTORAGE các tiện ích liên quan đến lưu trữ dữ liệu cục bộ
   * @param SERVICE_LOCALE các tiện ích liên quan đến ngôn ngữ
   */
  constructor(
    private readonly STORE_CONVERSATION = useConversationStore(),
    private readonly STORE_ORG = useOrgStore(),
    private readonly STORE_PAGE = usePageStore(),
    private readonly STORE_CHATBOT_USER = useChatbotUserStore(),
    private readonly STORE_COMMON = useCommonStore(),
    private readonly SERVICE_WINDOW_ACTION: IWindowAction = container.resolve(
      WindowAction
    ),
    private readonly SERVICE_PARSER: IParser = container.resolve(Parser),
    private readonly SERVICE_LOCALSTORAGE: ILocalStorage = container.resolve(
      LocalStorage
    ),
    private readonly SERVICE_LOCALE: ILocale = container.resolve(Locale)
  ) {}

  /**lấy id trang hiện tại của hội thoại */
  private getCurrentConversationPageId(): string {
    /**id trang */
    let PAGE_ID = this.STORE_CONVERSATION.select_conversation?.fb_page_id

    // nếu page chưa có hội thoại nào thì lấy trang đầu tiên được chọn
    if (!PAGE_ID) {
      /**store dữ liệu trang */
      const pageStore = usePageStore()

      // lấy id trang đầu tiên được chọn
      PAGE_ID = keys(pageStore.selected_page_id_list)?.[0]
    }

    // nếu vẫn không có id trang thì báo lỗi
    if (!PAGE_ID) throw new NotFoundError('PAGE_ID')

    // trả về id trang
    return PAGE_ID
  }
  /**lấy các tham số chung */
  private getCommonParams(): Record<string, any> {
    return {
      locale: this.SERVICE_LOCALE.get(),
      org_id: this.STORE_ORG.selected_org_id,
    }
  }
  /**
   * mở trang web ở tab mới
   * @param uri đường dẫn
   * @param path đường dẫn cụ thể
   * @param qs dữ liệu đính kèm url
   */
  private openSite(uri: string, path?: string, qs?: string) {
    // mở tab mới
    this.SERVICE_WINDOW_ACTION.openNewTab(`${uri}/${path}?${qs}`)
  }
  /**tính uri phù hợp với đối tác */
  private calcUri(site: keyof IExternalLink): string {
    /** Môi trường đang chạy */
    const NODE_ENV: string = import.meta.env.VITE_APP_ENV


    /**đường dẫn được thiết lập của đối tác */
    let uri:string | undefined
    
    // nếu là môi trường production thì dùng link của đối tác
    if(NODE_ENV === 'production') {
      uri = this.STORE_COMMON.partner?.external_link?.[site]
    }

    // sử dụng link default nếu không có link của đối tác
    if (!uri) uri = $env.external_link[site]

    // nếu không có đường dẫn thì báo lỗi
    if (!uri) throw new NotFoundError('URI')

    // trả về đường dẫn
    return uri
  }

  openPageSetting(path: string = '') {
    // nếu không phải là admin thì không được phép
    if (!this.STORE_PAGE.isPageAdminOrOrgAdmin(this.STORE_CONVERSATION.select_conversation?.fb_page_id)) return

    /**id trang */
    const PAGE_ID = this.getCurrentConversationPageId()

    /**đường dẫn */
    const URI = this.calcUri('setting')

    /**dữ liệu đính kèm url */
    const QS = this.SERVICE_PARSER.toQueryString({
      ...this.getCommonParams(),

      token: this.SERVICE_LOCALSTORAGE.getItem('access_token'),
      fb_page_id: PAGE_ID,
      page_id: PAGE_ID,
    })

    // mở tab mới
    this.openSite(URI, path, QS)
  }
  openPageAnalytic(path: string = '') {
    /**đường dẫn */
    const URI = this.calcUri('analytic')

    /**id các trang đang chọn */
    const PAGE_IDS = keys(this.STORE_PAGE.selected_page_id_list)?.join()

    /**dữ liệu đính kèm url */
    const QS = this.SERVICE_PARSER.toQueryString({
      ...this.getCommonParams(),

      access_token: this.SERVICE_LOCALSTORAGE.getItem('access_token'),
      page_id: PAGE_IDS,
    })

    // mở tab mới
    this.openSite(URI, path, QS)
  }
  openPageChatbot(path: string = '') {
    /**đường dẫn */
    const URI = this.calcUri('chatbot')

    /**id các trang đang chọn */
    const PAGE_ID = this.getCurrentConversationPageId()

    /**dữ liệu đính kèm url */
    const QS = this.SERVICE_PARSER.toQueryString({
      ...this.getCommonParams(),

      access_token: this.SERVICE_LOCALSTORAGE.getItem('access_token'),
      page_id: PAGE_ID,
    })

    // mở tab mới
    this.openSite(URI, path, QS)
  }
  openMerchant(path: string = '', redirect: string = '') {
    /**đường dẫn */
    const URI = this.calcUri('merchant')

    /**id trang đang chọn */
    const PAGE_ID = this.getCurrentConversationPageId()

    /**token đối tác của trang này */
    const PARTNER_TOKEN =
      this.STORE_PAGE.selected_page_list_info?.[PAGE_ID]?.partner_token

    /**dữ liệu đính kèm url */
    const QS = this.SERVICE_PARSER.toQueryString({
      chat_access_token: PARTNER_TOKEN,
      redirect: `${URI}/${redirect}`,
    })

    // mở tab mới
    this.openSite(URI, path, QS)
  }
  openSystemDashboard(path: string = '') {
    // nếu không phải là thành viên hệ thống thì không được phép
    if (!this.STORE_CHATBOT_USER.isBbhMember()) return

    /**đường dẫn */
    const URI = this.calcUri('admin')

    /**dữ liệu đính kèm url */
    const QS = this.SERVICE_PARSER.toQueryString({
      ...this.getCommonParams(),

      token: this.SERVICE_LOCALSTORAGE.getItem('access_token'),
    })

    // mở tab mới
    this.openSite(URI, path, QS)
  }
}
