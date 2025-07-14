<template>
  <div class="flex flex-col gap-1">
    <h1 class="custom-title">
      {{ $t('Đặt lại mật khẩu tài khoản') }}
    </h1>
    <small class="text-sm">
      {{
        $t('Đối với tài khoản _', {
          name: form.email,
        })
      }}
    </small>
  </div>
  <AlertError />
  <div class="flex flex-col gap-3">
    <div class="flex flex-col gap-1">
      <small class="font-medium text-sm">
        {{ $t('Mật khẩu mới') }}
      </small>
      <InputPassword
        v-model="form.password"
        @enter="$main.resetPassword()"
        :placeholder="$t('Nhập _ của bạn', { name: $t('Mật khẩu mới') })"
      />
    </div>
    <div class="flex flex-col gap-1">
      <small class="font-medium text-sm">
        {{ $t('Xác nhận mật khẩu mới') }}
      </small>
      <InputPassword
        v-model="form.confirm_password"
        @enter="$main.resetPassword()"
        :placeholder="
          $t('Nhập _ của bạn', { name: $t('Xác nhận mật khẩu mới') })
        "
      />
    </div>
    <button
      @click="$main.resetPassword()"
      class="custom-btn-black"
    >
      {{ $t('Đặt lại mật khẩu') }}
    </button>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { N4SerivcePublicOauthBasic } from '@/utils/api/N4Service/Oauth'
import { composableValidate } from './validate'

import InputPassword from '@/views/OAuth/InputPassword.vue'
import AlertError from '@/views/OAuth/AlertError.vue'

import { composableService } from './service'
import { container } from 'tsyringe'

const { VLD_EMAIL_PASSWORD_AND_CONFIRM } = composableValidate()
const { handleLoadingOauth, handleErrorOauth, ServiceOAuth } =
  composableService()

const $route = useRoute()
const { t: $t } = useI18n()

/**form đặt lại mật khẩu */
const form = ref<{
  /**email */
  email: string
  /**mật khẩu */
  password: string
  /**xác nhận mật khẩu */
  confirm_password: string
}>({
  email: '',
  password: '',
  confirm_password: '',
})
/**mã xác thực tài khoản */
const verify_code = ref<string>($route.query.verify_code as string)

class Main {
  /**
   * @param API_OAUTH_BASIC API đăng nhập
   * @param SERVICE_OAUTH service xử lý đăng nhập
   */
  constructor(
    private readonly API_OAUTH_BASIC = new N4SerivcePublicOauthBasic(),
    private readonly SERVICE_OAUTH = container.resolve(ServiceOAuth)
  ) {}

  /**đăng nhập bằng email*/
  @handleLoadingOauth
  @handleErrorOauth()
  async resetPassword() {
    // xác thực dữ liệu
    await VLD_EMAIL_PASSWORD_AND_CONFIRM.validate(form.value)

    // xác thực mật khẩu
    if (form.value.password !== form.value.confirm_password)
      throw $t('Mật khẩu không khớp')

    // đặt lại mật khẩu
    await this.API_OAUTH_BASIC.ressetPassword(
      form.value.email,
      form.value.password,
      verify_code.value
    )

    // chuyển hướng đến trang đăng nhập email + thông báo
    this.SERVICE_OAUTH.redirect({
      path: '/oauth/login-email',
      query: { email: form.value.email, reset_password: 'true' },
    })
  }
}
const $main = new Main()

// nếu có email thì gán vào form
onMounted(() => (form.value.email = $route.query.email as string))
</script>
<style scoped lang="scss">
@import './index.scss';
</style>
