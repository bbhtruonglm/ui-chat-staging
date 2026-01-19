<template>
  <div id="take-control">
    <Facebook
      :text="$t('v1.view.oauth.login.btn_text')"
      class="h-[40px] w-full md:w-[350px]"
      @access_token="loginChatbox"
    />

    <div class="h-[500px] overflow-y-auto flex flex-col gap-2">
      <div
        v-for="page of pages"
        class="flex gap-4"
      >
        <button
          @click="selected_page = page"
          class="flex items-center gap-2 bg-slate-100 w-[400px]"
        >
          <img
            :src="`https://graph.facebook.com/${page?.id}/picture`"
            class="w-8 h-8 rounded-full"
          />
          <div>
            <div>{{ page?.name }}</div>
            <div>{{ page?.id }}</div>
          </div>
        </button>
        <button
          @click="deleteBbhToken(page?.id)"
          class="bg-slate-100"
        >
          xóa token bbh
        </button>
      </div>
    </div>

    <button
      v-if="selected_page"
      @click="takeControl"
      class="flex items-center gap-2 bg-slate-100"
    >
      <img
        :src="`https://graph.facebook.com/${selected_page?.id}/picture`"
        class="w-8 h-8 rounded-full"
      />
      {{ selected_page?.name }}
    </button>
  </div>
</template>
<script setup lang="ts">
import { useCommonStore } from '@/stores'
import { ref } from 'vue'

import Facebook from '@/components/OAuth/Facebook.vue'
import { container } from 'tsyringe'
import { Toast } from '@/utils/helper/Alert/Toast'

/** instance toast để hiển thị thông báo */
const $toast = container.resolve(Toast)

/** danh sách pages Facebook mà user quản lý */
const pages = ref<any[]>()

/** page đang được chọn để xử lý */
const selected_page = ref<any>()

/** xóa token bbh của page */
async function deleteBbhToken(page_id: string) {
  // TAB NÀY ẨN BÊN NGỌC DUNG, BỎ QUA KHÔNG XỬ LÝ
  // gọi API xóa token
  await fetch(
    `https://chatbox-merge-v2.botbanhang.vn/service/page/remove_bbh_token?page_id=${page_id}`
  )

  // thông báo thành công
  $toast.success('ok')
}

/** đăng nhập chatbox bằng token fb */
async function loginChatbox(access_token: string) {
  // log token để debug
  console.log(access_token)

  /** gọi Facebook Graph API lấy danh sách pages */
  const RES = await fetch(
    `https://graph.facebook.com/v21.0/me/accounts?access_token=${access_token}&limit=200`
  )

  /** parse response JSON */
  const PAGES = await RES.json()

  // lưu danh sách pages vào state
  pages.value = PAGES?.data

  // log để debug
  console.log(pages.value)
}

/** take control conversation của page */
async function takeControl() {
  // TAB NÀY ẨN BÊN NGỌC DUNG, BỎ QUA KHÔNG XỬ LÝ
  // gọi API take control với page_id và access_token của page
  await fetch(
    `https://chatbox-merge-v2.botbanhang.vn/service/page/take_control_conversation?page_id=${selected_page.value?.id}&access_token=${selected_page.value?.access_token}`
  )

  // thông báo thành công
  $toast.success('ok')
}
</script>
