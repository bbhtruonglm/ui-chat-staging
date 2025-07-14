<template>
  <div class="flex flex-col gap-1">
    <strong class="custom-title">
      {{ $t('Bạn quên mật khẩu?') }}
    </strong>
    <small class="text-sm">
      {{
        $t('Chúng tôi sẽ gửi hướng dẫn qua email để đặt lại mật khẩu của bạn.')
      }}
    </small>
  </div>
  <AlertError />
  <div class="flex flex-col gap-3">
    <div class="flex flex-col gap-1">
      <small class="font-medium text-sm">
        {{ $t('Email') }}
      </small>
      <input
        v-model="email"
        @keyup.enter="$main.forgotPassword()"
        autocapitalize="off"
        autocorrect="off"
        :placeholder="$t('Nhập _ của bạn', { name: $t('email') })"
        class="custom-input"
      />
    </div>
    <button
      @click="$main.forgotPassword"
      class="custom-btn-black"
    >
      {{ $t('Đặt lại mật khẩu') }}
    </button>
  </div>
  <div
    @click="$service_oauth.redirect('/oauth')"
    class="text-sm custom-link"
  >
    {{ $t('Quay lại trang đăng nhập') }}
  </div>
</template>
<script setup lang="ts">
import { useRoute, type LocationQueryRaw } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

import { composableService } from '@/views/OAuth/service'
import { container } from 'tsyringe'
import { composableValidate } from './validate'

import AlertError from '@/views/OAuth/AlertError.vue'

import { N4SerivcePublicOauthBasic } from '@/utils/api/N4Service/Oauth'

const { VLD_EMAIL } = composableValidate()
const { ServiceOAuth, handleLoadingOauth, handleErrorOauth } =
  composableService()

const { t: $t } = useI18n()
const $service_oauth = container.resolve(ServiceOAuth)
const $route = useRoute()

/**email đăng nhập */
const email = ref<string>($route.query.email as string)

class Main {
  /**
   * @param SERVICE_OAUTH service đăng nhập
   * @param API_OAUTH_BASIC api đăng nhập
   */
  constructor(
    private readonly SERVICE_OAUTH = $service_oauth,
    private readonly API_OAUTH_BASIC = new N4SerivcePublicOauthBasic()
  ) {}

  /**quay lại trang đăng nhập email */
  goLogin(is_show_alert?: boolean) {
    /**query gửi qua trang đăng nhập */
    const QUERY: LocationQueryRaw = { email: email.value }

    // hiển thị thêm alert đã gửi mail nếu cần
    if (is_show_alert) QUERY.forgot_password = 'true'

    // chuyển hướng vào trang đăng nhập email
    this.SERVICE_OAUTH.redirect({
      path: '/oauth/login-email',
      query: QUERY,
    })
  }
  /**gửi yêu cầu đặt lại mật khẩu */
  @handleLoadingOauth
  @handleErrorOauth()
  async forgotPassword() {
    // kiểm tra email
    await VLD_EMAIL.validate({ email: email.value })

    // gửi yêu cầu đặt lại mật khẩu
    await this.API_OAUTH_BASIC.forgotPassword(email.value!)

    // quay lại trang đăng nhập + thông báo
    this.goLogin(true)
  }
}
const $main = new Main()
</script>
<style scoped lang="scss">
@import './index.scss';
</style>
