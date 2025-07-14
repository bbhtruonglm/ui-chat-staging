<template>
  <DeauthorizeInstagram v-if="error_reason" />
  <Loading
    v-else
    type="FULL"
  />
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrgStore } from '@/stores'
import { container } from 'tsyringe'
import { N4SerivceAppPage } from '@/utils/api/N4Service/Page'
import { error } from '@/utils/decorator/Error'

import DeauthorizeInstagram from '@/views/DeauthorizeInstagram.vue'
import Loading from '@/components/Loading.vue'

const $route = useRoute()
const $router = useRouter()
const orgStore = useOrgStore()

/**code từ IG */
const code = ref($route.query.code as string)
const error_reason = ref($route.query.error_reason as string)

class Main {
  /**
   * @param API_PAGE api truy cập trang
   */
  constructor(
    private readonly API_PAGE = container.resolve(N4SerivceAppPage)
  ) {}

  @error()
  /**xử lý code để tạo ra token cá nhân IG */
  async handleCode() {
    // nếu có lỗi thì không xử lý
    if (error_reason.value) return

    /**id tổ chức đang được chọn */
    const ORG_ID = orgStore.selected_org_id

    // chạy api kết nối IG, tự động thêm vào tổ chức nếu có thể
    await this.API_PAGE.syncInstagramPage(
      code.value,
      $env.instagram.redirect_uri,
      ORG_ID
    )

    // chuyển hướng về trang kết nối, nếu chưa tự động thêm thì mở trang thêm page vào tổ chức
    const QUERY = ORG_ID ? undefined : { connect_page: 'PAGE' }

    // chuyển hướng
    $router.push({ path: '/dashboard/select-page', query: QUERY })
  }
}
const $main = new Main()

// khi component được mount thì xử lý code
onMounted(() => $main.handleCode())
</script>
