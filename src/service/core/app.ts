import { createPinia } from 'pinia'

import type { App } from 'vue'
import type { Cb } from '@/service/interface/function'

export const loadApp = (APP: App, proceed: Cb) => {
    // init store
    APP.use(createPinia())

    proceed()
}