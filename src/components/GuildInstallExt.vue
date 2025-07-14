<template>
  <BaseModal
    ref="ref_guild_install_ext_modal"
    class_modal="w-[881px] h-[630px] gap-2 text-sm font-medium bg-glass p-2"
    class_close="rounded-lg bg-slate-100"
    class_body="bg-white rounded-md grid grid-cols-2 gap-1"
    class_footer="flex justify-end"
  >
    <template v-slot:header>
      {{ $t('Cài đặt Extension') }}
    </template>
    <template v-slot:body>
      <article class="flex flex-col justify-center items-center">
        <img
          src="@/assets/icons/ext.png"
          class="size-32"
        />
        <p>{{ $t('Bạn chưa cài đặt Extension.') }}</p>
      </article>
      <article class="p-2 flex-grow min-h-0">
        <div
          class="border rounded-lg p-2 h-full flex flex-col gap-2.5 overflow-y-auto"
        >
          <h3 class="py-1 px-2 rounded bg-slate-200">
            {{ $t('Hướng dẫn cài đặt') }}
          </h3>
          <p>
            {{ $t('Xem Video hướng dẫn') }}:
            <a
              href="https://www.youtube.com/@botbanhang1594"
              target="_blank"
              class="custom-link"
            >
              @botbanhang1594
            </a>
          </p>
          <hr />
          <p>{{ $t('Hoặc thực hiện theo hướng dẫn bên dưới') }}:</p>
          <ul class="custom-list">
            {{
              $t('Bước _', { name: 1 })
            }}:
            <li>
              {{ $t('Tải Extension. Lưu ý: Extension chỉ hỗ trợ Chrome.') }}
            </li>
          </ul>
          <a
            href="https://drive.google.com/drive/folders/1MmMPWM7wbB3qpK95x42KADdUSCxOhWUv"
            target="_blank"
            class="custom-btn text-white bg-slate-700 w-fit no-underline"
          >
            {{ $t('Tải Extension') }}
          </a>
          <ul class="custom-list">
            {{
              $t('Bước _', { name: 2 })
            }}:
            <li>
              {{ $t('Giải nén file đã tải về và có thư mục Retion-x.y') }}
            </li>
          </ul>
          <ul class="custom-list">
            {{
              $t('Bước _', { name: 3 })
            }}:
            <li>
              {{ $t('Truy cập') }}
              <a
                href="chrome://extensions/"
                target="_blank"
                class="custom-link"
              >
                chrome://extensions/
              </a>
            </li>
            <li
              v-html="$t('Bật chế độ Developer mode ở trên cùng góc phải.')"
            />
            <li
              v-html="
                $t('Ấn nút Load unpacked và chọn thư mục đã giải nén ở Bước 2.')
              "
            />
          </ul>
          <ul class="custom-list">
            {{
              $t('Bước _', { name: 4 })
            }}:
            <li>
              {{
                $t(
                  'Sau khi cài đặt xong thì ấn F5 hoặc ấn Làm mới trang để tải lại trang.'
                )
              }}
            </li>
          </ul>
          <button
            @click="$router.go(0)"
            class="custom-btn bg-slate-200 text-slate-700 w-fit"
          >
            {{ $t('Làm mới trang') }}
          </button>
        </div>
      </article>
    </template>
    <template v-slot:footer>
      <button
        @click="$main.toggleModal"
        class="custom-btn bg-white text-slate-700"
      >
        {{ $t('Đóng') }}
      </button>
    </template>
  </BaseModal>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import BaseModal from '@/components/Base/BaseModal.vue'

/**ref của modal hướng dẫn cài đặt */
const ref_guild_install_ext_modal = ref<InstanceType<typeof BaseModal>>()

class Main {
  /**Hiển thị modal hướng dẫn cài đặt */
  toggleModal() {
    // ẩn hiện modal
    ref_guild_install_ext_modal.value?.toggleModal?.()
  }
}
const $main = new Main()

defineExpose({ toggleModal: $main.toggleModal.bind($main) })
</script>
<style lang="scss" scoped>
.custom-btn {
  @apply py-2 px-4 rounded-md;
}
.custom-list {
  @apply list-disc list-inside;
}
.custom-link {
  @apply text-blue-700 no-underline;
}
</style>
