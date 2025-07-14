<template>
  <div class="flex gap-2.5 flex-grow min-h-0">
    <div
      class="w-[119px] flex-shrink-0 bg-gray-100 rounded-md p-1 gap-1 flex flex-col overflow-y-auto"
    >
      <Tab
        v-model="selected_tab"
        value="ALL"
        :title="$t('v1.view.main.dashboard.chat.client.ai_menu.all')"
      />
      <Tab
        v-model="selected_tab"
        value="EMOTION"
        :title="$t('v1.view.main.dashboard.chat.client.ai_menu.emotion')"
      />
      <Tab
        v-model="selected_tab"
        value="SCHEDULE"
        :title="$t('v1.view.main.dashboard.chat.client.ai_menu.schedule')"
      />
      <Tab
        v-model="selected_tab"
        value="ORDER"
        :title="$t('v1.view.main.dashboard.chat.client.ai_menu.order')"
      />
      <Tab
        v-model="selected_tab"
        value="TRANSACTION"
        :title="$t('v1.view.main.dashboard.chat.client.ai_menu.transaction')"
      />
      <Tab
        v-model="selected_tab"
        value="PHONE"
        :title="$t('v1.view.main.dashboard.chat.client.ai_menu.call')"
      />
      <Tab
        v-model="selected_tab"
        value="EMAIL"
        :title="$t('v1.view.main.dashboard.chat.client.ai_menu.email')"
      />
      <Tab
        v-model="selected_tab"
        value="ADDRESS"
        :title="$t('v1.view.main.dashboard.chat.client.ai_menu.address')"
      />
    </div>
    <div class="flex-grow min-w-0 flex flex-col gap-1 border rounded">
      <div class="flex-grow min-h-0 overflow-x-auto relative">
        <table class="w-full table-fixed border-collapse text-xs">
          <thead>
            <tr class="sticky left-0 top-0 border-b bg-white font-semibold">
              <th class="item">
                {{ $t('v1.view.main.dashboard.chat.client.time') }}
              </th>
              <th class="item">
                {{ $t('v1.view.main.dashboard.chat.client.type') }}
              </th>
              <th class="item w-28">
                {{ $t('v1.view.main.dashboard.chat.client.value') }}
              </th>
              <th class="item w-64">
                {{ $t('v1.view.main.dashboard.chat.client.message') }}
              </th>
              <th class="item">
                {{ $t('v1.view.main.dashboard.chat.client.convert') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="event of list_event"
              class="border-b"
            >
              <td class="item">
                {{ dateFormat(event.timestamp?.toString(), 'hh:mm - dd/MM') }}
              </td>
              <td class="item">
                {{ event.type }}
              </td>
              <td class="item truncate">
                {{ event?.detect }}
              </td>
              <td class="item truncate">
                {{ event?.data?.text }}
              </td>
              <td class="item">
                {{ event?.cta }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        class="flex-shrink-0 flex items-center gap-5 justify-end p-1 relative"
      >
        <div
          v-if="is_loading"
          class="absolute left-1/2 -translate-x-1/2"
        >
          <Loading />
        </div>
        <div class="flex items-center gap-2">
          <LeftSquareIcon
            @click="changePage('PREV')"
            class="text-slate-500 w-7 h-7 cursor-pointer"
          />
          <div
            class="py-0.5 px-2 rounded-md bg-blue-700 text-white text-sm font-medium"
          >
            {{ page }}
          </div>
          <LeftSquareIcon
            @click="changePage('NEXT')"
            class="text-slate-500 w-7 h-7 rotate-180 cursor-pointer"
          />
        </div>
        <select
          v-model="limit"
          class="py-2 px-3 rounded-md border text-sm focus:outline-none"
        >
          <option value="20">
            20 / {{ $t('v1.view.main.dashboard.chat.client.page') }}
          </option>
          <option value="30">
            30 / {{ $t('v1.view.main.dashboard.chat.client.page') }}
          </option>
          <option value="50">
            50 / {{ $t('v1.view.main.dashboard.chat.client.page') }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { toastError } from '@/service/helper/alert'
import { dateFormat } from '@/service/helper/format'
import { useConversationStore, useOrgStore } from '@/stores'
import { N9AnalyticAppAnalytic, type EventInfo } from '@/utils/api/N9Analytic'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import Tab from '@/views/ChatWarper/Chat/CenterContent/UserInfo/ClientInfo/RightBar/Ai/Tab.vue'
import Loading from '@/components/Loading.vue'

import LeftSquareIcon from '@/components/Icons/LeftSquare.vue'

/**dữ liệu sự kiện đã xử lý */
interface HandledEventInfo extends EventInfo {
  /**dữ liệu */
  data?: {
    /**tin nhắn gốc */
    text?: string
  }
  /**loại tin nhắn */
  type?: string
  /**giá trị */
  detect?: string
  /**chuyển đổi */
  cta?: string
}

const orgStore = useOrgStore()
const conversationStore = useConversationStore()
const { t: $t } = useI18n()

/**tab đang chọn */
const selected_tab = ref<
  | 'ALL'
  | 'SCHEDULE'
  | 'ORDER'
  | 'TRANSACTION'
  | 'PHONE'
  | 'EMAIL'
  | 'ADDRESS'
  | 'EMOTION'
>('ALL')
/**danh sách sự kiện */
const list_event = ref<HandledEventInfo[]>()
/**giới hạn số bản ghi */
const limit = ref<20 | 30 | 50>(20)
/**số trang hiện tại */
const page = ref(1)
/**có đang load dữ liệu không */
const is_loading = ref(false)

/**id của page */
const page_id = computed(
  () => conversationStore.select_conversation?.fb_page_id
)
/**id của client */
const client_id = computed(
  () => conversationStore.select_conversation?.fb_client_id
)

// lấy dữ liệu khi component được mount
onMounted(readEvent)

// lấy dữ liệu khi tab thay đổi
watch(() => selected_tab.value, readEvent)
// lấy dữ liệu khi giới hạn thay đổi
watch(() => limit.value, readEvent)
// lấy dữ liệu khi trang thay đổi
watch(() => page.value, readEvent)

/**đổi trang */
function changePage(type: 'NEXT' | 'PREV') {
  if (type === 'NEXT') page.value++
  else if (page.value > 1) page.value--
}
/**tính toán sự kiện được lọc */
function calcFilterEvent() {
  /**danh sách sự kiện được lọc */
  let filter_event: string[] = []

  /**các sự kiện cảm xúc */
  const EMOTION = [
    'client_emotion_happiness',
    'client_emotion_sadness',
    'client_emotion_fear',
    'client_emotion_anger',
    'client_emotion_surprise',
    'client_emotion_disgust',
    'client_emotion_love',
    'client_emotion_jealousy',
    'client_emotion_shame',
    'client_emotion_pride',
    'client_emotion_none',
    'client_positive',
    'client_negative',
    'client_neutral',
  ]
  /**các sự kiện lịch hẹn */
  const SCHEDULE = ['schedule_ai_detect']
  /**các sự kiện đặt hàng */
  const ORDER = ['order_ai_detect']
  /**các sự kiện giao dịch */
  const TRANSACTION = ['transaction_ai_detect']
  /**các sự kiện gọi điện */
  const PHONE = ['phone_ai_detect']
  /**các sự kiện email */
  const EMAIL = ['email_ai_detect']
  /**các sự kiện địa chỉ */
  const ADDRESS = ['address_ai_detect']

  //  tính toán sự kiện được lọc
  switch (selected_tab.value) {
    case 'ALL':
      filter_event = [
        ...EMOTION,
        ...SCHEDULE,
        ...ORDER,
        ...TRANSACTION,
        ...PHONE,
        ...EMAIL,
        ...ADDRESS,
      ]
      break
    case 'EMOTION':
      filter_event = EMOTION
      break
    case 'SCHEDULE':
      filter_event = SCHEDULE
      break
    case 'ORDER':
      filter_event = ORDER
      break
    case 'TRANSACTION':
      filter_event = TRANSACTION
      break
    case 'PHONE':
      filter_event = PHONE
      break
    case 'EMAIL':
      filter_event = EMAIL
      break
    case 'ADDRESS':
      filter_event = ADDRESS
      break
  }

  // trả về dữ liệu
  return filter_event
}
/**đọc các sự kiện */
async function readEvent() {
  // kiểm tra xem đã chọn org và conversation chưa
  if (!page_id.value || !client_id.value) return

  // bắt đầu load dữ liệu
  is_loading.value = true

  try {
    /**bỏ qua số bản ghi */
    const SKIP = limit.value * (page.value - 1)
    /**danh sách sự kiện */
    const FILTER_EVENT = calcFilterEvent()

    // lấy dữ liệu
    const LIST_EVENT = await new N9AnalyticAppAnalytic(
      page_id.value,
      client_id.value
    ).readEvent(FILTER_EVENT, SKIP, limit.value)

    // xử lý dữ liệu
    list_event.value = LIST_EVENT?.map(event => ({
      ...event,
      type: getType(event?.event),
      detect: getValue(event?.event),
      cta: getCta(event?.event),
    }))
  } catch (e) {
    // bắn lỗi
    toastError(e)
  }

  // kết thúc load dữ liệu
  is_loading.value = false
}
/**lấy dữ liệu */
function getValue(input?: string) {
  const VALUE = input?.replace('client_', '')?.replace('emotion_', '')

  // xử lý dữ liệu
  switch (VALUE) {
    case 'schedule_ai_detect':
      return $t('v1.view.main.dashboard.chat.message.cta.schedule_appointment')
    case 'order_ai_detect':
      return $t('v1.view.main.dashboard.chat.message.cta.place_order')
    case 'transaction_ai_detect':
      return $t('v1.view.main.dashboard.chat.message.cta.create_transaction')
    default:
      return VALUE
  }
}
/**lấy loại */
function getType(input?: string) {
  // nếu không có dữ liệu thì thôi
  if (!input) return '-'

  // cảm xúc
  if (input?.includes('client_'))
    return $t('v1.view.main.dashboard.chat.client.type_emotion')

  // tạm thời lấy giống cta
  return getCta(input)
}
/**lọc ra CTA */
function getCta(input?: string) {
  // xử lý dữ liệu
  switch (input) {
    case 'schedule_ai_detect':
      return $t('v1.view.main.dashboard.chat.message.cta.schedule_appointment')
    case 'order_ai_detect':
      return $t('v1.view.main.dashboard.chat.message.cta.place_order')
    case 'transaction_ai_detect':
      return $t('v1.view.main.dashboard.chat.message.cta.create_transaction')
    default:
      return '-'
  }
}
</script>
<style scoped lang="scss">
.item {
  @apply py-1 px-2 text-left whitespace-nowrap;
}
</style>
