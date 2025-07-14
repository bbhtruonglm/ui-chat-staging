import { IndexedDB } from '@/service/helper/indexedDB'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import type { Cb } from '../interface/function'
import type { App } from 'vue'

export const loadLib = (APP: App, proceed: Cb) => {
    // khởi tạo kết nối đến indexeDB của trình duyệt
    globalThis.$indexed_db = new IndexedDB()


    /** cấu hình thư viện vue-toastification */
    const OPTIONS = {
        transition: 'Vue-Toastification__bounce', // hoặc 'none'
        maxToasts: 5,
        newestOnTop: true,
    }

    // khởi tạo thư viện vue-toastification
    APP.use(Toast, OPTIONS)


    proceed()
}