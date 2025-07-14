import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useExtensionStore = defineStore('extension_store', () => {
    /**gắn cờ đánh dấu là đang tìm kiếm uid khách hàng */
    const is_find_uid = ref<Record<string, boolean>>({})
    /**gắn cờ đánh dấu là đang tìm kiếm thông tin khách hàng */
    const is_find_client_info = ref<Record<string, boolean>>({})

    return {
        is_find_uid,
        is_find_client_info
    }
})