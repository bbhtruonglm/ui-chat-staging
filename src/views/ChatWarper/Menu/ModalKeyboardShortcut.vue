<template>
  <BaseModal
    ref="base_modal"
    class_modal="w-[1100px] max-h-[90dvh] gap-2 text-sm font-medium p-2 bg-glass"
    class_close="rounded-lg bg-slate-100"
    class_body="bg-white rounded-md flex flex-col px-2"
    class_footer="flex justify-end"
  >
    <template #body>
      <header class="flex justify-between items-center py-2.5 px-2 border-b sticky top-0 bg-white">
        <h2 class="text-base font-semibold">Phím tắt</h2>
        <button>
          <XMarkIcon class="w-7 h-7" 
            @click="toggleModal()"
          />
        </button>
      </header>
      <section
        v-for="shortcut in SHORTCUT_LIST"
        class="font-medium pt-2 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 lg:gap-x-12 gap-y-3"
      >
        <h3 class="px-2 text-xs text-slate-500 sm:col-span-2 lg:col-span-3">
          {{ shortcut.type }}
        </h3>
        <div
          v-for="item in shortcut.list"
          class="flex gap-2 items-center justify-center px-3"
        >
          <component
            :is="item.icon"
            class="w-6 h-6 flex-shrink-0"
          />
          <p class="w-full">{{ item.name }}</p>
          <div class="flex gap-1 items-center">
            <p
              v-for="key in item.key"
              class="border rounded px-2"
              :class="
                item?.color
                  ? item?.color
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              "
            >
              {{ KEYS?.[key]?.[PLATFORM] || key }}
            </p>
          </div>
        </div>
      </section>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import BaseModal from '@/components/Base/BaseModal.vue';

import ToggleRight from '@/components/Icons/ToggleRight.vue';
import {
  ArrowLeftCircleIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  BellAlertIcon,
  BellSlashIcon,
  BoltIcon,
  BookmarkSquareIcon,
  CalendarDaysIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  EnvelopeIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  MinusCircleIcon,
  NewspaperIcon,
  QueueListIcon,
  ReceiptRefundIcon,
  RectangleGroupIcon,
  ShoppingBagIcon,
  SparklesIcon,
  Square2StackIcon,
  SwatchIcon,
  TagIcon,
  UserCircleIcon,
  UsersIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline';
import { XMarkIcon } from '@heroicons/vue/24/solid';

/** danh sách các phím tắt */
const SHORTCUT_LIST = [
  {
    type: 'Bố cục',
    list: [
      {
        icon: ArrowLeftCircleIcon,
        name: 'Quay lại chọn trang',
        key: ['Ctrl', 'Shift', '←'],
        color: 'bg-blue-100 border-blue-200 text-blue-700',
      },
      // {
      //   icon: ArrowsPointingInIcon,
      //   name: 'Thu nhỏ',
      //   key: ['Ctrl', '-'],
      // },
      // {
      //   icon: ArrowsPointingOutIcon,
      //   name: 'Phóng to',
      //   key: ['Ctrl', '+'],
      // },
      // {
      //   icon: BellSlashIcon,
      //   name: 'Tắt/bật thông báo',
      //   key: ['Ctrl', 'B'],
      // },
      // {
      //   icon: LockClosedIcon,
      //   name: 'Khóa màn hình',
      //   key: ['Ctrl', 'L'],
      // },
      {
        icon: BellSlashIcon,
        name: 'Đăng xuất',
        key: ['Alt', 'Shift' ,'E'],
      },
    ],
  },
  {
    type: 'Bộ lọc',
    list: [
      {
        icon: ChatBubbleOvalLeftEllipsisIcon,
        name: 'Lọc tương tác',
        key: ['Alt', '1'],
        
      },
      {
        icon: NewspaperIcon,
        name: 'Lọc trạng thái',
        key: ['Alt', '2'],
        color: 'bg-blue-100 border-blue-200 text-blue-700',
      },
      {
        icon: MagnifyingGlassIcon,
        name: 'Lọc số điện thoại',
        key: ['Alt', '3'],
      },
      {
        icon: CalendarDaysIcon,
        name: 'Lọc thời gian',
        key: ['Alt', '4'],
      },
      {
        icon: TagIcon,
        name: 'Lọc gán nhãn',
        key: ['Alt', '5'],
      },
      {
        icon: ReceiptRefundIcon,
        name: 'Lọc trừ nhãn',
        key: ['Alt', '6'],
      },
      {
        icon: UsersIcon,
        name: 'Lọc nhân viên',
        key: ['Alt', '7'],
      },
      {
        icon: NewspaperIcon,
        name: 'Lọc bài viết',
        key: ['Alt', '8'],
      },
      {
        icon: XCircleIcon,
        name: 'Xóa lọc',
        key: ['Alt', 'X'],
      },
    ],
  },
  {
    type: 'Hội thoại',
    list: [
      {
        icon: ChatBubbleOvalLeftEllipsisIcon,
        name: 'Chế độ Chat',
        key: ['Ctrl', '1'],
      },
      {
        icon: NewspaperIcon,
        name: 'Chế độ Bài viết',
        key: ['Ctrl', '2'],
      },
      {
        icon: MagnifyingGlassIcon,
        name: 'Tìm kiếm',
        key: ['Alt', 'K'],
      },
      {
        icon: SwatchIcon,
        name: 'Ẩn/hiện nhãn',
        key: ['Ctrl', 'L'],
      },
    ],
  },
  {
    type: 'Tin nhắn',
    list: [
      {
        icon: UserCircleIcon,
        name: 'Xem hồ sơ',
        key: ['Ctrl', 'P'],
      },
      {
        icon: EnvelopeIcon,
        name: 'Đọc / chưa đọc',
        key: ['Ctrl', 'R'],
      },
      {
        icon: MinusCircleIcon,
        name: 'Chặn người dùng',
        key: ['Ctrl', 'Shift' , 'X'],
      },
      {
        icon: Square2StackIcon,
        name: 'Chép số điện thoại',
        key: ['Ctrl', 'Shift', 'P'],
        color: 'bg-blue-100 border-blue-200 text-blue-700',
      },
      {
        icon: Square2StackIcon,
        name: 'Chép email',
        key: ['Ctrl', 'Shift', 'E'],
        color: 'bg-blue-100 border-blue-200 text-blue-700',
      },
      {
        icon: BoltIcon,
        name: 'Trả lời nhanh',
        key: ['/'],
      },
    ],
  },
  {
    type: 'Widget',
    list: [
      {
        icon: QueueListIcon,
        name: 'Mở Widget đầu tiên',
        key: ['Alt', 'Q'],
      },
      {
        icon: QueueListIcon,
        name: 'Mở Widget thứ 2',
        key: ['Alt', 'W'],
      },
      {
        icon: QueueListIcon,
        name: 'Mở Widget thứ 3',
        key: ['Alt', 'E'],
      },
      {
        icon: ToggleRight,
        name: 'Ẩn/hiện tất cả',
        key: ['Alt', '~'],
        color: 'bg-blue-100 border-blue-200 text-blue-700',
      },
      // {
      //   icon: BellAlertIcon,
      //   name: 'Lập lịch',
      //   key: ['Alt', 'S'],
      // },
      // {
      //   icon: BookmarkSquareIcon,
      //   name: 'CRM',
      //   key: ['Alt', 'M'],
      // },
      // {
      //   icon: ShoppingBagIcon,
      //   name: 'Tạo đơn hàng',
      //   key: ['Alt', 'O'],
      // },
      // {
      //   icon: SparklesIcon,
      //   name: 'Trợ lý ảo',
      //   key: ['Alt', 'A'],
      // },
      {
        icon: RectangleGroupIcon,
        name: 'Cài đặt',
        key: ['Alt', 'Shift', 'M'],
      },
    ],
  },
]

/** các phím của mac và window */
const KEYS: Record<string, Record<string, string>> = {
  'Alt': {
    mac: 'Option',
    win: 'Alt',
  },
  'Ctrl': {
    mac: 'Control',
    win: 'Ctrl',
  },
}

const PLATFORM = isMac() ? 'mac' : 'win'

/** Ref của modal */
const base_modal = ref<InstanceType<typeof BaseModal>>()

/** bật modal */
function toggleModal() {
  base_modal.value?.toggleModal()
}

/** kiểm tra thiết vị là mac hay window */
function isMac() {
  console.log(navigator.userAgent, /macintosh|macintel|macppc|mac68k|macppc64/i.test(navigator.userAgent));
  
  return /macintosh|macintel|macppc|mac68k|macppc64/i.test(navigator.userAgent)
}

defineExpose({ toggleModal })
</script>
