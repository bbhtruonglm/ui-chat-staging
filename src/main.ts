/**cái này phải để trên cùng, không được xóa, hay thay đổi vị trí */
import 'reflect-metadata'

import { waterfall } from 'async'
import { createApp } from 'vue'
import App from '@/App.vue'
import {
  loadLib,
  loadApp,
  loadLanguage,
  loadDirective,
  loadRouter,
} from '@/service/core'

import type { CbError } from '@/service/interface/function'

import '@/assets/css/tailwind.css'
import '@/utils/helper/Validate'

import { container } from 'tsyringe'
import { EnvManage } from './utils/base/EnvManage'

const $env_manage = container.resolve(EnvManage)

/**khởi tạo ứng dụng*/
async function bootstrap() {
  /**đối tượng vue app */
  const APP = createApp(App)

  // TODO sau này dùng hết class thì không cần khai báo global nữa
  // nạp cài đặt môi trường vào biến toàn cục
  globalThis.$env = await $env_manage.loadEnv()
  // nạp giá trị môi trường hiện tại vào biến toàn cục
  globalThis.$node_env = $env_manage.NODE_ENV

  waterfall(
    [
      (cb: CbError) => loadLib(APP,cb),
      (cb: CbError) => loadRouter(APP, cb),
      (cb: CbError) => loadLanguage(APP, cb),
      (cb: CbError) => loadDirective(APP, cb),
      (cb: CbError) => loadApp(APP, cb),
    ],
    e => APP.mount('#app')
  )
}

// khởi tạo ứng dụng
bootstrap()