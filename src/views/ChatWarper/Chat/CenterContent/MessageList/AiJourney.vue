<template>
  <div
    v-if="$main.isVisible()"
    id="chat__alert-header"
    class="bg-white rounded-lg py-1 px-3 shadow-sm top-2 left-2 flex items-center gap-3"
  >
    <BellAlertIcon class="w-5 h-5 flex-shrink-0" />
    <div class="flex-grow">
      <div class="font-medium text-xxs flex items-center gap-1">
        {{ $t('v1.view.main.dashboard.chat.message.header.note') }}
        <Badge :value="2" />
      </div>
      <div class="text-xs font-medium truncate">
        <div>
          {{ $main.formatDate() }}
          - Nhắc khách thanh toán
        </div>
      </div>
    </div>
    <ArrowDown class="-rotate-90 w-3 text-slate-500 flex-shrink-0 mr-1" />
    <div class="w-100 h-fit bg-white px-3 pt-3 rounded-b-lg pb-20">
      <div class="relative border-l-2 border-blue-900 pl-3 space-y-2">
        <!-- Chào mừng -->
        <div>
          <div
            class="flex items-center text-xs text-slate-700 justify-between pl-3"
          >
            <span>Journey AI</span>
            <span class="text-slate-500">14:32 – 12/05</span>
          </div>
          <div class="flex items-center pl-3">
            <div class="relative w-3 h-3 z-10 bg-blue-900 rounded-full -ml-31">
              <span
                class="absolute top-1 left-1 w-1 h-1 rounded-full bg-white"
              ></span>
            </div>
            <div class="ml-4 text-sm font-semibold">Chào mừng</div>
          </div>
        </div>
  
        <!-- kiểm tra đơn hàng -->
        <div>
          <div
            class="flex items-center text-xs text-slate-700 justify-between pl-3"
          >
            <span>Journey AI</span>
            <span class="text-slate-500">14:32 – 12/05</span>
          </div>
          <div class="flex items-center pl-3">
            <div class="relative w-3 h-3 z-10 bg-blue-900 rounded-full -ml-31">
              <span
                class="absolute top-1 left-1 w-1 h-1 rounded-full bg-white"
              ></span>
            </div>
            <div class="flex ml-4 gap-0.5 items-center">
              <ShoppingBagIcon class="w-4 h-4 text-black"></ShoppingBagIcon>
              <div class="text-sm font-semibold">Kiểm tra đơn hàng</div>
              <ChevronDownIcon
                class="w-3 h-3 mt-1 text-slate-500"
              ></ChevronDownIcon>
            </div>
          </div>
        </div>
  
        <!--  -->
        <div class="pl-22">
          <div class="relative border-l-3 border-slate-200 pl-2 space-y-2">
            <div>
              <div
                class="flex items-center pl-2 text-xs text-slate-700 justify-between"
              >
                <span>Integration Merchant</span>
                <span class="text-xs- text-slate-500">14:32 – 12/05</span>
              </div>
              <div class="flex items-center">
                <div
                  class="relative w-3 h-3 z-10 bg-slate-200 rounded-full -ml-15"
                >
                  <span
                    class="absolute top-1 left-1 w-1 h-1 rounded-full bg-white"
                  ></span>
                </div>
                <div class="flex ml-2 gap-0.5 items-center">
                  <MagnifyingGlassCircleIcon
                    class="w-4 h-4 text-slate-500"
                  ></MagnifyingGlassCircleIcon>
                  <div class="text-sm font-semibold">Tìm đơn hàng</div>
                  <ChevronRightIcon
                    class="w-3 h-3 mt-1 text-slate-500"
                  ></ChevronRightIcon>
                </div>
              </div>
            </div>
          </div>
          <div class="relative border-l-3 border-slate-200 pl-2 pt-2 space-y-2">
            <div>
              <div
                class="flex items-center pl-2 text-xs text-slate-700 justify-between"
              >
                <span>Integration Merchant</span>
                <span class="text-xs- text-slate-500">14:32 – 12/05</span>
              </div>
              <div class="flex items-center">
                <div
                  class="relative w-3 h-3 z-10 bg-slate-200 rounded-full -ml-15"
                >
                  <span
                    class="absolute top-1 left-1 w-1 h-1 rounded-full bg-white"
                  ></span>
                </div>
                <div class="flex ml-2 gap-0.5 items-center">
                  <ListBulletIcon class="w-4 h-4 text-slate-500"></ListBulletIcon>
                  <div class="text-sm font-semibold">Chi tiết đơn hàng</div>
                  <ChevronDownIcon
                    class="w-3 h-3 mt-1 text-slate-500"
                  ></ChevronDownIcon>
                </div>
              </div>
              <p class="text-xs pl-2">- ID khách hàng: 123421374</p>
              <p class="text-xs pl-2">- Chi tiết đơn hàng số: 29372</p>
            </div>
          </div>
        </div>
  
        <!--  -->
        <div>
          <div
            class="flex items-center text-xs text-slate-700 justify-between pl-3"
          >
            <span>Journey AI</span>
            <span class="text-slate-500">2 Tiếng trước</span>
          </div>
          <div class="flex items-center pl-3">
            <div class="relative w-3 h-3 z-10 bg-blue-900 rounded-full -ml-31">
              <span
                class="absolute top-1 left-1 w-1 h-1 rounded-full bg-white"
              ></span>
            </div>
            <div class="ml-4 text-sm font-semibold">Gợi ý sản phẩm</div>
          </div>
        </div>
        <!--  -->
        <div class="pl-22">
          <div class="relative border-l-3 border-slate-200 pl-2 space-y-2">
            <div>
              <div
                class="flex items-center pl-2 text-xs text-slate-700 justify-between"
              >
                <span>Integration Merchant</span>
                <span class="text-xs- text-slate-500">14:32 – 12/05</span>
              </div>
              <div class="flex items-center">
                <div
                  class="relative w-3 h-3 z-10 bg-slate-200 rounded-full -ml-15"
                >
                  <span
                    class="absolute top-1 left-1 w-1 h-1 rounded-full bg-white"
                  ></span>
                </div>
                <div class="flex ml-2 gap-0.5 items-center">
                  <MagnifyingGlassCircleIcon
                    class="w-4 h-4 text-slate-500"
                  ></MagnifyingGlassCircleIcon>
                  <div class="text-sm font-semibold">
                    Tìm thông tin khách hàng
                  </div>
                  <ChevronRightIcon
                    class="w-3 h-3 mt-1 text-slate-500"
                  ></ChevronRightIcon>
                </div>
              </div>
            </div>
          </div>
          <div class="relative border-l-3 pt-2 border-slate-200 pl-2 space-y-2">
            <div>
              <div
                class="flex items-center pl-2 text-xs text-slate-700 justify-between"
              >
                <span>Integration Merchant</span>
                <span class="text-xs- text-slate-500">14:32 – 12/05</span>
              </div>
              <div class="flex items-center">
                <div
                  class="relative w-3 h-3 z-10 bg-slate-200 rounded-full -ml-15"
                >
                  <span
                    class="absolute top-1 left-1 w-1 h-1 rounded-full bg-white"
                  ></span>
                </div>
                <div class="flex ml-2 gap-0.5 items-center">
                  <MagnifyingGlassCircleIcon
                    class="w-4 h-4 text-slate-500"
                  ></MagnifyingGlassCircleIcon>
                  <div class="text-sm font-semibold">
                    Tìm sản phẩm theo dữ liệu khách hàng
                  </div>
                  <ChevronRightIcon
                    class="w-3 h-3 mt-1 text-slate-500"
                  ></ChevronRightIcon>
                </div>
              </div>
            </div>
          </div>
          <div class="relative border-l-3 border-slate-200 pl-2 pt-2 space-y-2">
            <div>
              <div
                class="flex items-center pl-2 text-xs text-slate-700 justify-between"
              >
                <span>Integration Merchant</span>
                <span class="text-xs- text-slate-500">14:32 – 12/05</span>
              </div>
              <div class="flex items-center">
                <div
                  class="relative w-3 h-3 z-10 bg-slate-200 rounded-full -ml-15"
                >
                  <span
                    class="absolute top-1 left-1 w-1 h-1 rounded-full bg-white"
                  ></span>
                </div>
                <div class="flex ml-2 gap-0.5 items-center">
                  <ListBulletIcon class="w-4 h-4 text-slate-500"></ListBulletIcon>
                  <div class="text-sm font-semibold">
                    Kiểm tra khuyến mại, giảm giá
                  </div>
                  <ChevronDownIcon
                    class="w-3 h-3 mt-1 text-slate-500"
                  ></ChevronDownIcon>
                </div>
              </div>
              <p class="text-xs pl-2">- ID khách hàng: 123421374</p>
              <p class="text-xs pl-2">- Chi tiết đơn hàng số: 29372</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { EnvManage, type IEnvManage } from '@/utils/base/EnvManage'
import { container } from 'tsyringe'
import { DateHandle, type IDateHandle } from '@/utils/helper/DateHandle'

import Badge from '@/components/Badge.vue'

import BellAlertIcon from '@/components/Icons/BellAlert.vue'
import ArrowDown from '@/components/Icons/ArrowDown.vue'

import {
  ShoppingBagIcon,
  MagnifyingGlassCircleIcon,
  ListBulletIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/solid'

class Main {
  /**
   * @param SERVICE_ENV dịch vụ quản lý biến môi trường
   * @param SERVICE_DATE dịch vụ xử lý thời gian
   */
  constructor(
    private readonly SERVICE_ENV: IEnvManage = container.resolve(EnvManage),
    private readonly SERVICE_DATE: IDateHandle = container.resolve(DateHandle)
  ) {}

  /**tạm thời chỉ hiển thị component này ở bản non prod */
  isVisible(): boolean {
    return false
    // nếu là production thì không hiển thị
    if (this.SERVICE_ENV.NODE_ENV === 'production') return false

    // nếu là non production thì hiển thị
    return true
  }
  /**định dạng thời gian */
  formatDate() {
    // tạm thời trả về hiện tại
    return this.SERVICE_DATE.format(new Date(), 'HH:mm dd/MM')
  }
}
const $main = new Main()
</script>
