import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOAuthStore = defineStore('oauth_store', () => {
  /**thông báo lỗi */
  const error_message = ref<string>()

  return {
    error_message,
  }
})
