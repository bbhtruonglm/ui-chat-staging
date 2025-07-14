<template>
    <div class="bg-gray-100 flex items-center justify-center min-h-screen">
        <div class="bg-white p-8 rounded shadow-md w-full max-w-sm">
            <h1 class="text-2xl font-semibold mb-4">Delete Account</h1>
            <p class="text-gray-600 mb-6">
                Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div class="flex flex-col items-center">
                <template v-if="!staff_id">
                    <div class="mb-1">OAuth with Facebook to continue</div>
                    <Facebook :text="$t('v1.view.oauth.login.btn_text')" class="h-[40px] w-full mb-4"
                        @access_token="loginChatbox" />
                </template>
                <template v-else>
                    <div class="mb-1 font-bold">
                        {{ staff_name }}
                    </div>
                    <StaffAvatar :id="staff_id" class="mb-4 w-24 h-24"/>
                    <button @click="deleteAccount" class="bg-red-600 text-white px-4 py-2 rounded-full w-full">
                        Delete Account
                    </button>
                </template>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { flow } from '@/service/helper/async'
import { login_facebook } from '@/service/api/chatbox/n4-service'
import { ref } from 'vue'
import { read_me_chatbot_user } from '@/service/api/chatbox/n4-service'
import { setItem } from '@/service/helper/localStorage'

import Facebook from '@/components/OAuth/Facebook.vue'
import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'

import type { CbError } from '@/service/interface/function'
import Swal from 'sweetalert2'

/**id của nhân viên */
const staff_id = ref<string>()
/**tên của nhân viên */
const staff_name = ref<string>()

/**đăng nhập chatbox bằng token fb */
function loginChatbox(access_token: string) {
    const DATA: {
        access_token: string
    } = {
        access_token: ''
    }
    flow([
        // * đăng nhập FB
        (cb: CbError) => login_facebook(access_token, (e, r) => {
            if (e) return cb(e)

            staff_id.value = r?.fb_staff_id
            DATA.access_token = r.access_token
            cb()
        }),
        // * lưu token xuống local
        (cb: CbError) => { 
            setItem('access_token', DATA.access_token)

            cb()
        },
        // * call api
        (cb: CbError) => read_me_chatbot_user((e, r) => {
            if (e) return cb(e)

            staff_name.value = r?.full_name
            cb()
        }),
    ], undefined, true)
}
/**fake xoá tài khoản */
function deleteAccount() {
    flow([
        // * delay
        (cb: CbError) => setTimeout(() => cb(), 2000),
        // * alert
        (cb: CbError) => {
            cb()

            // xoá dữ liệu
            staff_id.value = undefined
            staff_name.value = undefined

            // thông báo thành công
            Swal.fire({
                title: 'Account Deleted',
                text: 'Your account has been deleted',
                icon: 'success',
            })
        },
    ], undefined, true)
}
</script>