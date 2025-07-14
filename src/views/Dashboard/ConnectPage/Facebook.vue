<template>
  <EmptyPage
    :icon="FacebookIcon"
    :guild="
      $t('v1.view.main.dashboard.select_platform.facebook.guild', {
        partner: commonStore.partner?.name,
      })
    "
    :description="
      $t('v1.view.main.dashboard.select_platform.facebook.description')
    "
    class_guild="w-[482px]"
  >
    <template #button>
      <Facebook
        :option="genFBSelectPageOption()"
        @access_token="syncFacebookPage"
        class="h-12"
      />
    </template>
  </EmptyPage>
</template>
<script setup lang="ts">
import { useCommonStore, useConnectPageStore } from '@/stores'

import EmptyPage from '@/views/Dashboard/ConnectPage/EmptyPage.vue'
import Facebook from '@/components/OAuth/Facebook.vue'

import FacebookIcon from '@/components/Icons/Facebook.vue'
import { N4SerivceAppPage } from '@/utils/api/N4Service/Page'
import { ToastSingleton } from '@/utils/helper/Alert/Toast'

const connectPageStore = useConnectPageStore()
const commonStore = useCommonStore()

/**sử dụng thiết lập này để hiển thị danh sách trang muốn cấp quyền */
function genFBSelectPageOption() {
  let login_option = {
    scope: [
      'public_profile',
      'pages_show_list',
      'pages_messaging',
      'email',
      'pages_read_user_content',
      'pages_read_engagement',
      'read_insights',
      // 'instagram_basic',
      'instagram_manage_comments',
      'instagram_manage_insights',
      'pages_manage_metadata',
      'pages_manage_posts',
      'pages_manage_engagement',
      'ads_management',
      'business_management'
    ].join(),
    enable_profile_selector: true,
    auth_type: 'rerequest',
  }
  return JSON.stringify(login_option)
}
/**đồng bộ dữ liệu page mới nhất từ fb */
async function syncFacebookPage(access_token: string, from: string) {
  try {
    // hiển thị loading
    commonStore.is_loading_full_screen = true

    // đồng bộ dữ liệu page từ fb
    await new N4SerivceAppPage().syncFacebookPage(access_token)

    // quay lại page danh sách trang
    connectPageStore.selectMenu('PAGE')
  } catch (e) {
    // hiển thị lỗi
    ToastSingleton.getInst().error(e)
  } finally {
    // tắt loading
    commonStore.is_loading_full_screen = false
  }
}
</script>
