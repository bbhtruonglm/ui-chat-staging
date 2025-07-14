import { get } from 'lodash'
import { singleton } from 'tsyringe'
import { UninitializedError } from '../error/Uninitialized'

/**lấy thông tin môi trường hiện tại */
export interface IEnvManage {
  /**giá trị môi trường hiện tại */
  readonly NODE_ENV: string

  /**nạp cài đặt môi trường */
  loadEnv(): Promise<IEnv>
  /**
   * lấy giá trị môi trường hiện tại
   * @param path đường dẫn đến giá trị cần lấy
   */
  get<T = any>(path?: string): T
}

/**lấy thông tin môi trường hiện tại */
@singleton()
export class EnvManage implements IEnvManage {
  /**lưu trữ cài đặt của môi trường */
  private store?: IEnv

  /**
   * @param NODE_ENV giá trị môi trường hiện tại
   */
  constructor(
    public readonly NODE_ENV: string = import.meta.env.VITE_APP_ENV ||
      'development'
  ) {}

  /**nạp cài đặt môi trường */
  async loadEnv(): Promise<IEnv> {
    // nếu đã có cài đặt thì trả về
    if (this.store) return this.store

    // lấy cài đặt môi trường mới
    const { default: ENV } = (await import(
      `../../configs/envs/${this.NODE_ENV}.ts`
    )) as { default: IEnv }

    // lưu cài đặt môi trường
    this.store = ENV

    // trả về cài đặt môi trường
    return this.store
  }

  get<T = any>(path?: string): T {
    // nếu chưa có cài đặt thì báo lỗi
    if (!this.store) throw new UninitializedError('ENV')

    // nếu không có đường dẫn thì trả về toàn bộ cài đặt
    if (!path) return this.store as unknown as T

    // lấy giá trị theo đường dẫn
    return get(this.store, path)
  }
}
