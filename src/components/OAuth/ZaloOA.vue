<template>
  <button
    @click="oAuthByRedirectZalo"
    class="flex justify-between items-center py-2 px-4 gap-2 bg-slate-100 rounded-md hover:brightness-90"
  >
    <ZaloIcon class="w-4 h-4" />
    <div class="text-slate-900 text-sm font-semibold">
      {{ text }}
    </div>
  </button>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useChatbotUserStore, useCommonStore } from '@/stores'
import { N4SerivceAppPage } from '@/utils/api/N4Service/Page'

import ZaloIcon from '@/components/Icons/Zalo.vue'
import { ToastSingleton } from '@/utils/helper/Alert/Toast'

const $emit = defineEmits(['done'])

const $props = withDefaults(
  defineProps<{
    /**nội dung hiển thị trên button */
    text?: string
  }>(),
  {}
)

const $route = useRoute()
const $router = useRouter()
const chatbotUserStore = useChatbotUserStore()
const commonStore = useCommonStore()
const toast = ToastSingleton.getInst()

onMounted(() => afterOauth())

/**cấp quyền bằng cách redirect của FB */
async function oAuthByRedirectZalo() {
  try {
    // nếu đang loading thì không cho chạy nữa
    if (commonStore.is_loading_full_screen) return

    // bật loading
    commonStore.is_loading_full_screen = true

    /**đường dẫn xin quyền của zalo */
    const URL = await new N4SerivceAppPage().zaloOaGetUrlOauth()

    // redirect đến đường dẫn zalo
    window.location.href = URL
  } catch (e) {
    // báo lỗi nếu phát sinh
    toast.error(e)
  } finally {
    // tắt loading
    commonStore.is_loading_full_screen = false
  }
}
/**xử lý sau khi OAuth xong */
async function afterOauth() {
  try {
    // bắt đầu loading
    commonStore.is_loading_full_screen = true

    // xoá query để không bị chạy 2 lần
    $router.replace({ path: $route.path, query: {} })

    // lấy dữ liệu từ query
    let { code, oa_id, state } = $route.query

    // nếu thiếu dữ liệu thì không làm gì cả
    if (!code || !oa_id || !state) return

    // gọi api để khởi tạo trang
    await new N4SerivceAppPage().syncZaloOaPage({
      oa_id,
      code,
      code_verifier: state,
      staff_name: chatbotUserStore.chatbot_user?.full_name,
    })

    // thông báo ra ngoài là đã oauth xong
    $emit('done')
  } catch (e) {
    // báo lỗi nếu phát sinh
    toast.error(e)
  } finally {
    // tắt loading
    commonStore.is_loading_full_screen = false
  }
}
</script>
