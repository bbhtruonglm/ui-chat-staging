import { Botx } from '@/utils/api/Botx'

/**gọi API lên server n4 của chatbox */
export class N4Serivce extends Botx {
  constructor(path: string) {
    // gọi API lên server của chatbox
    super(`${$env.host.n4_service_v2}/${path}`)
  }
}