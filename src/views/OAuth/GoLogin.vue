<template>
  <div class="custom-description">
    <span>
      {{ $t('Bạn đã có tài khoản _', { name: commonStore.partner?.name }) }}
    </span>
    <div
      @click="$service_oauth.redirect('/oauth')"
      class="custom-link"
    >
      {{ $t('Đăng nhập') }}
      <ArrowRightIcon class="w-4 h-4 lucide lucide-arrow-right" />
    </div>
  </div>
  <small
    @click="$event => $main.openLink($event)"
    v-html="$t('Bằng việc tiếp tục, bạn đồng ý với _ và _ của chúng tôi')"
    class="text-xs text-slate-700"
  />
</template>
<script setup lang="ts">
import { useCommonStore } from '@/stores'
import { composableService } from './service'
import { container } from 'tsyringe'

import { ArrowRightIcon } from '@heroicons/vue/24/solid'
import { WindowAction, type IWindowAction } from '@/utils/helper/Navigation'

const commonStore = useCommonStore()

const { ServiceOAuth, TERM, PRIVACY } = composableService()

const $service_oauth = container.resolve(ServiceOAuth)

class Main {
  /**
   * @param SERVICE_WINDOW_ACTION service xử lý cửa sổ
   */
  constructor(
    private readonly SERVICE_WINDOW_ACTION: IWindowAction = container.resolve(
      WindowAction
    )
  ) {}

  /**
   * Mở link khi click vào link từ i18n
   * @param $event sự kiện click
   */
  openLink($event: MouseEvent) {
    /**mục tiêu click */
    const TARGET = $event.target as HTMLElement

    /**id của target */
    const TARGET_ID = TARGET.id

    // mở link tương ứng
    switch (TARGET_ID) {
      case 'term':
        this.SERVICE_WINDOW_ACTION.openNewTab(TERM)
        break
      case 'privacy':
        this.SERVICE_WINDOW_ACTION.openNewTab(PRIVACY)
        break
    }
  }
}
const $main = new Main()
</script>
<style scoped lang="scss">
@import './index.scss';
</style>
