<template>
  <div
    @click="$main.deleteAccount"
    class="w-2.5 h-2.5 absolute top-0 right-0"
  />
  <div class="flex flex-col gap-1">
    <strong class="custom-title">
      {{ $t('Đăng ký _', { name: commonStore.partner?.name }) }}
    </strong>
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
        v-model="email"
        autocapitalize="off"
        autocorrect="off"
        @keyup.enter="$main.goRegisterDetail()"
        :placeholder="$t('Nhập _ của bạn', { name: $t('email') })"
        class="custom-input"
      />
    </div>
    <button
      @click="$main.goRegisterDetail"
      class="custom-btn-black"
    >
      {{
        $t('Đăng ký bằng _', {
          name: $t('Email'),
        })
      }}
    </button>
  </div>
  <Or />
  <div class="flex flex-col gap-3">
    <Facebook
      @access_token="access_token => $service_oauth.loginFb(access_token)"
      :text="
        $t('Đăng ký bằng _', {
          name: $t('Facebook'),
        })
      "
      btn_style="display:flex;justify-content:center;width:100%;height:100%;align-items:center;gap:0.5rem;background-color:#f1f5f9;border-radius:0.375rem;color:#0f172a;font-size:16px;font-weight:500;border-color:#e2e8f0;border-width:1px"
      class="h-12 w-full"
    />
  </div>
  <GoLogin />
</template>
<script setup lang="ts">
import { useCommonStore } from '@/stores'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { composableService } from '@/views/OAuth/service'
import { container } from 'tsyringe'
import { composableValidate } from './validate'
import Swal from 'sweetalert2'
import { BillingPrivate } from '@/utils/api/Billing'
import { Toast } from '@/utils/helper/Alert/Toast'
import { N4SerivcePublicOauthBasic } from '@/utils/api/N4Service/Oauth'

import Facebook from '@/components/OAuth/Facebook.vue'
import GoLogin from '@/views/OAuth/GoLogin.vue'
import Or from '@/views/OAuth/Or.vue'
import AlertError from '@/views/OAuth/AlertError.vue'

import type { IAlert } from '@/utils/helper/Alert/type'

const { VLD_EMAIL } = composableValidate()
const { ServiceOAuth, handleLoadingOauth, handleErrorOauth } =
  composableService()

const commonStore = useCommonStore()
const { t: $t } = useI18n()
const $service_oauth = container.resolve(ServiceOAuth)

/**email đăng nhập */
const email = ref<string>()

class Main {
  /**
   * @param API_BILLING API billing
   * @param API_OAUTH_BASIC API oauth basic
   * @param SERVICE_TOAST service toast
   * @param SERVICE_OAUTH service oauth
   */
  constructor(
    private readonly API_BILLING = new BillingPrivate(),
    private readonly API_OAUTH_BASIC = new N4SerivcePublicOauthBasic(),
    private readonly SERVICE_TOAST: IAlert = container.resolve(Toast),
    private readonly SERVICE_OAUTH = $service_oauth
  ) {}

  /**đăng nhập bằng email*/
  @handleLoadingOauth
  @handleErrorOauth()
  async goRegisterDetail() {
    // kiểm tra email
    await VLD_EMAIL.validate({ email: email.value })

    // kiểm tra email đã tồn tại trên hệ thống chưa
    await this.API_OAUTH_BASIC.checkEmail(email.value!)

    // chuyển hướng vào trang chi tiết đăng ký
    this.SERVICE_OAUTH.redirect({
      path: '/oauth/register-detail',
      query: { email: email.value },
    })
  }
  /**xóa tài khoản */
  async deleteAccount() {
    const {
      value: [EMAIL],
    } = await Swal.fire({
      title: 'xóa tài khoản',
      html: '<input id="swal-input1" class="swal2-input" placeholder="Email">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          // @ts-ignore
          document.getElementById('swal-input1')?.value,
        ]
      },
    })

    if (!EMAIL) return

    // xóa tài khoản
    await this.API_BILLING.deleteAccount(EMAIL)

    // thông báo
    this.SERVICE_TOAST.success('Đã xóa tài khoản')
  }
}
const $main = new Main()
</script>
<style scoped lang="scss">
@import './index.scss';
</style>
