<template>
  <div class="flex-grow min-h-0 overflow-y-auto flex flex-col gap-2.5">
    <EditItem
      @update="conversationStore.is_edit_client.client_name = true"
      :title="$t('v1.view.main.dashboard.chat.client.full_name')"
      :placeholder="$t('v1.view.main.dashboard.chat.client.full_name_require')"
      v-model="client_name"
    />
    <EditItemGroup
      :type="'PHONE'"
      :source="list_contact"
      :title="$t('v1.view.main.dashboard.chat.client.phone')"
      :create_title="$t('v1.view.main.dashboard.chat.client.create_phone')"
      :placeholder="$t('v1.view.main.dashboard.chat.client.phone_require')"
      is_allow_remove
    />
    <EditItemGroup
      :type="'EMAIL'"
      :source="list_contact"
      :title="$t('v1.view.main.dashboard.chat.client.email')"
      :create_title="$t('v1.view.main.dashboard.chat.client.create_email')"
      :placeholder="$t('v1.view.main.dashboard.chat.client.email_require')"
      is_allow_remove
    />
    <EditItemGroup
      :type="'ADDRESS'"
      :source="list_contact"
      :title="$t('v1.view.main.dashboard.chat.client.address')"
      :create_title="$t('v1.view.main.dashboard.chat.client.create_address')"
      :placeholder="$t('v1.view.main.dashboard.chat.client.address_require')"
      is_allow_remove
    />
    <InfoItem
      v-for="(value, key) of conversationStore.select_conversation?.client_bio
        ?.fb_info"
      :title="getClientFieldName(key)"
      :value
    />
  </div>
  <div
    v-if="conversationStore.getPage()?.type === 'FB_MESS'"
    class="flex-shrink-0 flex items-center gap-2.5"
  >
    <button
      @click="reloadClientInfo"
      :class="{
        'cursor-not-allowed': conversationStore.isFindClientInfo(),
      }"
      class="flex items-center text-slate-700 bg-slate-100 rounded-md text-sm py-2 px-4 gap-2 justify-center w-fit hover:brightness-90"
    >
      <ReloadContentIcon class="text-slate-700 w-4 h-4" />
      {{ $t('v1.view.main.dashboard.chat.client.reload_info') }}
      <Loading
        v-if="conversationStore.isFindClientInfo()"
        :size="20"
      />
    </button>
    <InfoIcon
      v-tooltip="$t('v1.view.main.dashboard.chat.client.require_ext')"
      class="w-4 h-4 text-slate-500 cursor-pointer"
    />
  </div>
  <GuildInstallExt ref="ref_guild_install_ext_modal" />
</template>
<script setup lang="ts">
import {
  useConversationStore,
  useExtensionStore,
  usePageStore,
  useCommonStore,
} from '@/stores'
import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref, watch } from 'vue'
import { get, keys, map, set, size } from 'lodash'
import { toastError } from '@/service/helper/alert'
import { getFbUserInfo } from '@/service/helper/ext'

import GuildInstallExt from '@/components/GuildInstallExt.vue'
import EditItem from '@/views/ChatWarper/Chat/CenterContent/UserInfo/ClientInfo/RightBar/EditItem.vue'
import InfoItem from '@/views/ChatWarper/Chat/CenterContent/UserInfo/ClientInfo/RightBar/InfoItem.vue'
import EditItemGroup from '@/views/ChatWarper/Chat/CenterContent/UserInfo/ClientInfo/RightBar/EditItemGroup.vue'
import Loading from '@/components/Loading.vue'

import InfoIcon from '@/components/Icons/Info.vue'
import ReloadContentIcon from '@/components/Icons/ReloadContent.vue'

import { AiAppContact, AiAppOneContact, type ContactInfo } from '@/utils/api/Ai'
import { N4SerivceAppOneConversation } from '@/utils/api/N4Service/Conversation'
import { eachOfLimit } from 'async'

const conversationStore = useConversationStore()
const extensionStore = useExtensionStore()
const pageStore = usePageStore()
const commonStore = useCommonStore()
const { t: $t } = useI18n()

/**danh sách liên lạc */
const list_contact = ref<ContactInfo[]>([])
/**ref của modal hướng dẫn cài đặt */
const ref_guild_install_ext_modal = ref<InstanceType<typeof GuildInstallExt>>()

/**id của trang */
const page_id = computed(
  () => conversationStore.select_conversation?.fb_page_id
)
/**id của khách hàng */
const client_id = computed(
  () => conversationStore.select_conversation?.fb_client_id
)
/**tên khách hàng */
const client_name = autoComputed(
  conversationStore.select_conversation,
  'client_name'
)

watch(() => conversationStore.is_edit_info, updateClientInfo)

// lấy danh sách liên lạc của khách hàng khi component được mount
onMounted(getContact)

/**tự động bindding 2 chiều cho computed của hội thoại */
function autoComputed(source: any, target: string) {
  // sử dụng computed để bindding 2 chiều
  return computed({
    // lấy giá trị từ dữ liệu gốc
    get: () => get(source, target),
    // set lại giá trị vào dữ liệu gốc khi thay đổi
    set: val => set(source, target, val),
  })
}
/**tạo ra tên của field */
function getClientFieldName(key: string) {
  /**đường dẫn i18n */
  const I18N_PATH = 'v1.view.main.dashboard.chat.client.field'

  /**tạo ra title */
  const TITLE = $t(`${I18N_PATH}.${key}`)

  // nếu chưa có i18n thì trả về key gốc
  if (TITLE?.includes(I18N_PATH)) return key

  // trả về title
  return TITLE
}
/**đọc danh sách liên lạc của khách hàng */
async function getContact() {
  try {
    // nếu chưa có id của trang hoặc khách hàng thì bỏ qua
    if (!page_id.value || !client_id.value) return

    /**danh sách liên lạc */
    list_contact.value = await new AiAppContact(
      page_id.value,
      client_id.value
    ).getContact()
  } catch (e) {
    // bắn lỗi ra thông báo
    toastError(e)
  }
}

/**làm mới thông tin khách hàng */
function reloadClientInfo() {
  // nếu chưa cài đặt ext thì mở hướng dẫn cài đặt
  if (commonStore.extension_status !== 'FOUND') {
    // mở modal hướng dẫn cài đặt
    ref_guild_install_ext_modal.value?.toggleModal?.()

    // dừng
    return
  }

  // nếu thiếu key thì không làm gì cả
  if (
    !conversationStore.select_conversation?.fb_page_id ||
    !conversationStore.select_conversation?.data_key
  )
    return

  // gắn cờ đang tìm kiếm thông tin khách hàng
  extensionStore.is_find_client_info[
    conversationStore.select_conversation?.data_key
  ] = true

  // quá 10s thì thôi không loading nữa
  setTimeout(() => {
    // tắt cờ đang quét thông tin khách hàng
    extensionStore.is_find_client_info[
      conversationStore.select_conversation?.data_key!
    ] = false
  }, 10000)

  // gọi ext để lấy uid và thông tin khách hàng
  getFbUserInfo(
    conversationStore.select_conversation?.platform_type,
    conversationStore.select_conversation?.fb_page_id,
    conversationStore.select_conversation?.fb_client_id,
    pageStore?.selected_page_list_info?.[
      conversationStore.select_conversation?.fb_page_id
    ]?.page?.fb_page_token
  )
}
/**cập nhật các dữ liệu đã sửa */
async function updateClientInfo(is_edit_info: boolean) {
  // chỉ chạy khi kết thúc việc sửa thông tin
  if (is_edit_info || commonStore.is_loading_full_screen) return

  // bật loading
  commonStore.is_loading_full_screen = true

  try {
    // nếu có sửa tên khách hàng thì cập nhật
    if (conversationStore.is_edit_client?.client_name) await updateClientName()

    // tạo mới liên hệ
    if (size(conversationStore.is_edit_client?.contact_create))
      await createContact()

    // xoá liên hệ
    if (size(conversationStore.is_edit_client?.contact_remove))
      await removeContact()

    // cập nhật  liên hệ
    if (size(conversationStore.is_edit_client?.contact_update))
      await updateContact()

    // reset lại cờ sau khi xong
    conversationStore.is_edit_client = {
      contact_create: {},
      contact_remove: {},
      contact_update: {},
    }
  } catch (e) {
    // bắn lỗi ra thông báo
    toastError(e)
  }

  // tắt loading
  commonStore.is_loading_full_screen = false
}
/**cập nhật tên khách hàng lên hệ thống */
async function updateClientName() {
  try {
    // nếu chưa có id của trang hoặc khách hàng thì bỏ qua
    if (!page_id.value || !client_id.value) return

    // gọi api cập nhật tên khách hàng
    await new N4SerivceAppOneConversation(
      page_id.value,
      client_id.value
    ).updateClientName(client_name.value)
  } catch (e) {
    throw e
  }
}
/**tạo mới liên hệ */
async function createContact() {
  try {
    // nếu chưa có id của trang hoặc khách hàng thì bỏ qua
    if (!page_id.value || !client_id.value) return

    /**danh sách liên hệ mới */
    const LIST_NEW_CONTACT = list_contact.value?.filter(
      contact =>
        // phải có giá trị
        contact?.contact_value &&
        // nằm trong danh sách cần tạo mới
        conversationStore.is_edit_client.contact_create[contact?._id!]
    )

    // TODO verify input?

    // lặp qua từng liên hệ để tạo mới
    await eachOfLimit(LIST_NEW_CONTACT, 1, async (contact: ContactInfo, i) => {
      // gọi api tạo mới liên hệ
      await new AiAppOneContact(page_id.value!, client_id.value!).createContact(
        contact?.contact_type,
        contact?.contact_value!
      )
    })
  } catch (e) {
    // bắn lỗi ra ngoài
    throw e
  }
}
/**xoá liên hệ */
async function removeContact() {
  try {
    // nếu chưa có id của trang hoặc khách hàng thì bỏ qua
    if (!page_id.value || !client_id.value) return

    /**id các liên hệ muốn xoá */
    const LIST_REMOVE_CONTACT_ID = keys(
      conversationStore.is_edit_client.contact_remove
    )?.filter(
      contact_id =>
        // bỏ qua các id ở trong danh sách tạo mới (do mới tạo trên UI, DB chưa có, không cần xoá)
        !conversationStore.is_edit_client.contact_create?.[contact_id]
    )

    // lặp qua từng liên hệ để xoá
    await eachOfLimit(
      LIST_REMOVE_CONTACT_ID,
      1,
      async (contact_id: string, i) => {
        // gọi api xoá
        await new AiAppOneContact(
          page_id.value!,
          client_id.value!,
          contact_id
        ).removeContact()
      }
    )
  } catch (e) {
    // bắn lỗi ra ngoài
    throw e
  }
}
/**cập nhật liên hệ */
async function updateContact() {
  try {
    // nếu chưa có id của trang hoặc khách hàng thì bỏ qua
    if (!page_id.value || !client_id.value) return

    /**danh sách liên hệ cập nhật */
    const LIST_UPDATE_CONTACT = list_contact.value?.filter(
      contact =>
        // phải có giá trị, xoá trắng tạm thời không tính
        contact?.contact_value &&
        // nằm trong danh sách cần cập nhật
        conversationStore.is_edit_client.contact_update[contact?._id!] &&
        // bỏ qua các id ở trong danh sách tạo mới vì sẽ gọi api tạo
        !conversationStore.is_edit_client.contact_create?.[contact?._id!]
    )

    // TODO verify input?

    // lặp qua từng liên hệ để cập nhật
    await eachOfLimit(
      LIST_UPDATE_CONTACT,
      1,
      async (contact: ContactInfo, i) => {
        // gọi api xoá
        await new AiAppOneContact(
          page_id.value!,
          client_id.value!,
          contact?._id
        ).updateContact(contact.contact_value!)
      }
    )
  } catch (e) {
    // bắn lỗi ra ngoài
    throw e
  }
}
</script>
