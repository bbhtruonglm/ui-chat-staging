<template>
  <div class="flex flex-col gap-1">
    <button
      @click="$router.back()"
      class="custom-title"
    >
      <ArrowLeftIcon class="w-6 h-6" />
      {{ $t('Đăng ký _', { name: commonStore.partner?.name }) }}
    </button>
    <small class="custom-description">
      {{ $t('Một bước cuối cùng trước khi bắt đầu sử dụng') }}
    </small>
  </div>
  <AlertError />
  <div class="flex flex-col gap-3">
    <div class="flex flex-col gap-1">
      <small class="font-medium text-sm">
        {{ $t('Email') }}
      </small>
      <input
        v-model="form.email"
        autocapitalize="off"
        autocorrect="off"
        :placeholder="$t('Nhập _ của bạn', { name: $t('email') })"
        class="custom-input"
      />
    </div>
    <div
      :class="{
        'flex-row-reverse': locale !== 'vn',
      }"
      class="flex gap-2.5"
    >
      <div class="flex flex-col gap-1">
        <small class="font-medium text-sm">
          {{ $t('Họ') }}
        </small>
        <input
          v-model="form.last_name"
          :placeholder="$t('Nhập _ của bạn', { name: $t('Họ') })"
          class="custom-input"
        />
      </div>
      <div class="flex flex-col gap-1">
        <small class="font-medium text-sm">
          {{ $t('Tên') }}
        </small>
        <input
          v-model="form.first_name"
          :placeholder="$t('Nhập _ của bạn', { name: $t('Tên') })"
          class="custom-input"
        />
      </div>
    </div>
    <div class="flex flex-col gap-1">
      <small class="font-medium text-sm">
        {{ $t('Mật khẩu') }}
      </small>
      <InputPassword
        v-model="form.password"
        :placeholder="$t('Nhập _ của bạn', { name: $t('Mật khẩu') })"
      />
    </div>
    <div class="flex flex-col gap-1">
      <small class="font-medium text-sm">
        {{ $t('Xác nhận mật khẩu') }}
      </small>
      <InputPassword
        v-model="form.confirm_password"
        :placeholder="$t('Xác nhận mật khẩu')"
      />
    </div>
    <button
      @click="$main.register()"
      class="custom-btn-black"
    >
      {{
        $t('Đăng ký bằng _', {
          name: $t('Email'),
        })
      }}
    </button>
  </div>
  <GoLogin />
</template>
<script setup lang="ts">
import { useCommonStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref } from 'vue'
import { LocalStorage, type ILocalStorage } from '@/utils/helper/LocalStorage'
import { container } from 'tsyringe'
import { N4SerivcePublicOauthBasic } from '@/utils/api/N4Service/Oauth'
import { Toast } from '@/utils/helper/Alert/Toast'
import { composableValidate } from './validate'
import { TriggerEventRef } from '@/utils/helper/TriggerEventRef'

import AlertError from '@/views/OAuth/AlertError.vue'
import GoLogin from '@/views/OAuth/GoLogin.vue'
import InputPassword from '@/views/OAuth/InputPassword.vue'

import { ArrowLeftIcon } from '@heroicons/vue/24/solid'

import type { IAlert } from '@/utils/helper/Alert/type'
import { composableService } from './service'

const { VLD_EMAIL_REGISTER } = composableValidate()
const { handleLoadingOauth, handleErrorOauth, ServiceOAuth } =
  composableService()

const $router = useRouter()
const $route = useRoute()
const commonStore = useCommonStore()
const { t: $t, locale } = useI18n()

/**form đăng ký */
const form = ref<{
  /**email */
  email: string
  /**tên */
  first_name: string
  /**họ */
  last_name: string
  /**mật khẩu */
  password: string
  /**xác nhận mật khẩu */
  confirm_password: string
}>({
  email: '',
  first_name: '',
  last_name: '',
  password: '',
  confirm_password: '',
})

class Main {
  /**
   * @param API_OAUTH_BASIC API đăng nhập
   * @param SERVICE_LOCAL_STORAGE service lưu trữ
   * @param SERVICE_TOAST service thông báo
   */
  constructor(
    private readonly API_OAUTH_BASIC = new N4SerivcePublicOauthBasic(),
    private readonly SERVICE_LOCAL_STORAGE: ILocalStorage = container.resolve(
      LocalStorage
    ),
    private readonly SERVICE_TOAST: IAlert = container.resolve(Toast),
    private readonly SERVICE_OAUTH = container.resolve(ServiceOAuth),
    private readonly TRIGGER_EVENT_REF = container.resolve(TriggerEventRef)
  ) {}

  /**đăng ký */
  @handleLoadingOauth
  @handleErrorOauth()
  async register() {
    // xóa khoảng trắng
    form.value.email = form.value.email.trim()
    form.value.first_name = form.value.first_name?.trim()
    form.value.last_name = form.value.last_name?.trim()
    form.value.password = form.value.password.trim()
    form.value.confirm_password = form.value.confirm_password.trim()

    // xác thực form
    await VLD_EMAIL_REGISTER.validate(form.value)

    // xác thực mật khẩu
    if (form.value.password !== form.value.confirm_password)
      throw $t('Mật khẩu không khớp')

    // đăng ký
    await this.API_OAUTH_BASIC.register(
      form.value.email,
      form.value.password,
      full_name.value,
      form.value.first_name,
      form.value.last_name,
      this.SERVICE_LOCAL_STORAGE.getItem('ref')
    )

    // thông báo thành công
    this.SERVICE_TOAST.success($t('Đăng ký tài khoản thành công'))

    // đăng ký thành công thì chuyển về đăng nhập email
    this.SERVICE_OAUTH.redirect({
      path: '/oauth/login-email',
      query: { email: form.value.email, register: 'true' },
    })

    // trigger message tới nhân viên
    this.TRIGGER_EVENT_REF.sendMessageRegisterEmail(form.value.email)
  }
}
const $main = new Main()

// nếu có email thì gán vào form
onMounted(() => (form.value.email = $route.query.email as string))

/**tên đầy đủ */
const full_name = computed(() => {
  // tên tiếng việt bị ngược với thế giới
  if (locale.value === 'vn')
    return `${form.value.last_name} ${form.value.first_name}`

  // tên bình thường
  return `${form.value.first_name} ${form.value.last_name}`
})
</script>
<style scoped lang="scss">
@import './index.scss';
</style>
