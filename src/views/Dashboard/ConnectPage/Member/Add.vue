<template>
  <Alert
    ref="add_ref"
    class_modal="w-[507px]"
    class_body="pt-4 text-sm gap-2.5 flex flex-col"
    class_footer="flex justify-between items-center mt-6"
  >
    <template #header>
      {{ $t('v1.view.main.dashboard.org_staff.add.title') }}
    </template>
    <template #body>
      <input
        @keyup="findUser"
        :placeholder="$t('v1.view.main.dashboard.org_staff.add.guild_1')"
        class="py-2 px-3 rounded-md border shadow-sm focus:outline-orange-500 w-full"
      />
      <div class="flex items-center gap-4">
        <Radio
          v-model="role"
          value="ADMIN"
          :title="$t('v1.view.main.dashboard.org_staff.admin')"
        />
        <Radio
          v-model="role"
          value="STAFF"
          :title="$t('v1.view.main.dashboard.org_staff.member')"
        />
      </div>
      <div v-if="user?.full_name">
        {{ $t('v1.view.main.dashboard.org_staff.add.name') }}
        <span class="font-semibold">
          {{ user?.full_name }}
        </span>
      </div>
      <div v-if="role === 'STAFF'">
        {{ $t('v1.view.main.dashboard.org_staff.add.guild_2') }}
      </div>
      <div v-else>
        {{ $t('v1.view.main.dashboard.org_staff.add.guild_3') }}
      </div>
    </template>
    <template #footer>
      <button
        @click="toggleModal()"
        class="btn-custom bg-slate-100 text-slate-500"
      >
        {{ $t('v1.common.close') }}
      </button>
      <button
        @click="addStaff"
        :class="
          user?.full_name ? 'bg-blue-600' : 'bg-gray-500  cursor-not-allowed'
        "
        class="btn-custom text-white"
      >
        {{ $t('v1.common.more') }}
      </button>
    </template>
  </Alert>
</template>
<script setup lang="ts">
import { toastError } from '@/service/helper/alert'
import { useCommonStore, useOrgStore } from '@/stores'
import { onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import Alert from '@/components/Alert.vue'
import Radio from '@/views/Dashboard/Org/Pay/ReCharge/Radio.vue'

import { N4SerivceAppUser } from '@/utils/api/N4Service/User'
import { debounce } from 'lodash'

import { add_ms } from '@/service/api/chatbox/billing'
import type { MemberShipInfo } from '@/service/interface/app/billing'
import type { ChatbotUserInfo } from '@/service/interface/app/chatbot_user'

const $emit = defineEmits(['done'])

/** i18n */
const { t: $t } = useI18n()

const orgStore = useOrgStore()
const commonStore = useCommonStore()

/**chọn vai trò */
const role = ref<MemberShipInfo['ms_role']>('STAFF')
/**modal xác nhận huỷ trang */
const add_ref = ref<InstanceType<typeof Alert>>()
/**dữ liệu người dùng tim thấy */
const user = ref<ChatbotUserInfo>()

/**delay tìm kiếm hội người dùng */
const findUser = debounce(async ($event: Event) => {
  try {
    /**nội dung tìm kiếm */
    const { value: SEARCH } = $event.target as HTMLInputElement

    // nếu không có nội dung tìm kiếm thì thôi
    if (!SEARCH) throw 'CLEAR'

    // lưu dữ liệu người dùng tìm thấy
    user.value = await new N4SerivceAppUser().findUser(SEARCH)
  } catch (e) {
    // có lỗi thì xoá dữ liệu người dùng cũ
    user.value = undefined
  }
}, 300)
/**ẩn hiện modal của component */
function toggleModal() {
  add_ref.value?.toggleModal()
  // nếu đang mở thì clear dữ liệu người dùng
  if(add_ref.value?.is_open) {
    user.value = undefined
  }
}
/**thêm thành viên */
async function addStaff() {
  try {
    // nếu thiếu thông tin thì thôi
    if (
      !user.value?.full_name ||
      !user.value?.user_id ||
      !orgStore.selected_org_id
    )
      return

    // * kích hoạt loading
    commonStore.is_loading_full_screen = true

    // tắt modal
    // add_ref.value?.toggleModal()
    toggleModal()

    // thêm nhân viên vào tổ chức
    await add_ms(orgStore.selected_org_id, user.value?.user_id, role.value)

    // xoá dữ liệu người dùng
    user.value = undefined

    // thông báo thành công ra bên ngoài
    $emit('done')
  } catch (e) {
    // thông báo lỗi
    if(e === 'REACH_QUOTA.STAFF'){
      toastError($t('Số thành viên đạt giới hạn'))
    } else {
      toastError(e)
    }
  } finally {
    //  tắt loading
    commonStore.is_loading_full_screen = false
  }
}

defineExpose({ toggleModal })
</script>
<style scoped lang="scss">
.btn-custom {
  @apply text-sm font-medium rounded-md py-2 px-4 flex items-center gap-2 hover:brightness-90;
}
</style>
