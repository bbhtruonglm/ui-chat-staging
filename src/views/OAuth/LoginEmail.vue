<template>
  <div class="flex flex-col gap-1">
    <button
      @click="$router.back()"
      class="custom-title"
    >
      <ArrowLeftIcon class="w-6 h-6" />
      {{ $t('Đăng nhập') }}
    </button>
    <small class="text-sm">
      {{
        $t('Tiếp tục sử dụng _', {
          name: commonStore.partner?.name,
        })
      }}
    </small>
  </div>
  <AlertError />
  <Alert v-if="is_redirect_from_reset_password">
    {{ $t('Đã đặt lại mật khẩu!') }}
  </Alert>
  <Alert v-if="is_redirect_from_forgot_password">
    {{ $t('Một liên kết để đặt lại mật khẩu đã được gửi qua email cho bạn.') }}
  </Alert>
  <Alert v-if="is_redirect_from_register && form?.email">
    <div>
      {{
        $t(
          'Vui lòng xác minh địa chỉ email của bạn bằng cách truy cập vào liên kết được gửi đến _',
          { name: form.email }
        )
      }}
    </div>
    <div
      @click="$main.resendVerifyEmail()"
      :class="{
        underline: !is_resend_verify_email,
      }"
      class="font-medium cursor-pointer"
    >
      <template v-if="!is_resend_verify_email">
        {{ $t('Gửi lại email xác thực') }}
      </template>
      <template v-else>
        {{ $t('Đã gửi email xác thực!') }}
      </template>
    </div>
  </Alert>
  <Alert v-if="verify_code && is_verify_email">
    {{ $t('Email _ đã được xác nhận!', { name: form.email }) }}
  </Alert>
  <div class="flex flex-col gap-3">
    <div class="flex flex-col gap-1">
      <small class="font-medium text-sm">
        {{ $t('Email') }}
      </small>
      <input
        v-model="form.email"
        @keyup.enter="$main.loginEmail()"
        autocapitalize="off"
        autocorrect="off"
        :placeholder="$t('Nhập _ của bạn', { name: $t('Email') })"
        class="custom-input"
      />
    </div>
    <div class="flex flex-col gap-1">
      <small class="font-medium text-sm">
        {{ $t('Mật khẩu') }}
      </small>
      <InputPassword
        v-model="form.password"
        @enter="$main.loginEmail()"
        :placeholder="$t('Nhập _ của bạn', { name: $t('Mật khẩu') })"
      />
    </div>
    <div>
      <button
        @click="$main.forgotPassword()"
        class="font-medium text-sm text-blue-700"
      >
        {{ $t('Quên mật khẩu?') }}
      </button>
    </div>
    <button
      @click="$main.loginEmail"
      class="custom-btn-black"
    >
      {{ $t('Đăng nhập') }}
    </button>
  </div>
  <NewTo />
</template>
<script setup lang="ts">
import { useCommonStore } from '@/stores'
import { setItem } from '@/service/helper/localStorage'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { N4SerivcePublicOauthBasic } from '@/utils/api/N4Service/Oauth'
import { composableValidate } from './validate'
import { TriggerEventRef } from '@/utils/helper/TriggerEventRef'

import NewTo from '@/views/OAuth/NewTo.vue'
import Alert from '@/views/OAuth/Alert.vue'
import AlertError from '@/views/OAuth/AlertError.vue'
import InputPassword from '@/views/OAuth/InputPassword.vue'

import { ArrowLeftIcon } from '@heroicons/vue/24/solid'

import { composableService } from './service'
import { container } from 'tsyringe'

const { VLD_EMAIL_PASSWORD } = composableValidate()
const { handleLoadingOauth, handleErrorOauth, ServiceOAuth } =
  composableService()

const $router = useRouter()
const $route = useRoute()
const commonStore = useCommonStore()
const { t: $t } = useI18n()

/**form đăng nhập */
const form = ref<{
  /**email */
  email: string
  /**mật khẩu */
  password: string
}>({
  email: '',
  password: '',
})
/**có được redirect từ trang đăng ký tài khoản không */
const is_redirect_from_register = ref<boolean>(!!$route.query.register)
/**mã xác thực tài khoản */
const verify_code = ref<string>($route.query.verify_code as string)
/**đã xác thực email thành công chưa */
const is_verify_email = ref<boolean>(false)
/**đã gửi lại email xác thực chưa */
const is_resend_verify_email = ref<boolean>(false)
/**đã gửi lại email xác thực chưa */
const is_redirect_from_forgot_password = ref<boolean>(
  !!$route.query.forgot_password
)
/**đã gửi lại email xác thực chưa */
const is_redirect_from_reset_password = ref<boolean>(
  !!$route.query.reset_password
)

class Main {
  /**
   * @param API_OAUTH_BASIC API đăng nhập
   * @param SERVICE_OAUTH service xử lý đăng nhập
   */
  constructor(
    private readonly API_OAUTH_BASIC = new N4SerivcePublicOauthBasic(),
    private readonly SERVICE_OAUTH = container.resolve(ServiceOAuth),
    private readonly TRIGGER_EVENT_REF = container.resolve(TriggerEventRef)
  ) {}

  /**đăng nhập bằng email*/
  @handleLoadingOauth
  @handleErrorOauth((e: any) => {
    // nếu lúc đăng nhập mà tk chưa xác thực, thì bật cờ lên cho phép gửi lại email
    if (e?.message === 'COMMON.EMAIL_NOT_VERIFY')
      is_redirect_from_register.value = true
  })
  async loginEmail() {
    // xác thực dữ liệu
    await VLD_EMAIL_PASSWORD.validate(form.value)

    /**jwt đại diện cho người dùng */
    const { access_token: JWT } = await this.API_OAUTH_BASIC.login(
      form.value.email,
      form.value.password
    )

    // lưu token vào local storage
    setItem('access_token', JWT)

    // chuyển hướng vào dashboard
    this.SERVICE_OAUTH.redirect('/dashboard')

    // trigger message tới nhân viên
    this.TRIGGER_EVENT_REF.sendMessageLoginEmail(form.value.email)
  }
  /**gửi lại email xác thực */
  @handleLoadingOauth
  @handleErrorOauth()
  async resendVerifyEmail() {
    // nếu đã gửi email xác thực rồi thì không cho gửi lại
    if (is_resend_verify_email.value) return

    // gửi lại email xác thực
    await this.API_OAUTH_BASIC.resendVerifyEmail(form.value?.email)

    // gắn cờ là đã gửi email xác thực
    is_resend_verify_email.value = true
  }
  /**xác thực email */
  @handleLoadingOauth
  @handleErrorOauth()
  async verifyEmail() {
    // nếu không có mã xác thực thì thôi
    if (!verify_code.value) return

    // xác thực email
    await this.API_OAUTH_BASIC.verifyEmail(form.value.email, verify_code.value)

    // gắn cờ là đã xác thực email
    is_verify_email.value = true
  }
  /**quên mật khẩu */
  forgotPassword() {
    this.SERVICE_OAUTH.redirect({
      path: '/oauth/forgot-password',
      query: { email: form.value.email },
    })
  }
}
const $main = new Main()

// nếu có email thì gán vào form
onMounted(() => (form.value.email = $route.query.email as string))
// tự động xác thực email nếu có mã xác thực
onMounted(() => $main.verifyEmail())
</script>
<style scoped lang="scss">
@import './index.scss';
</style>
