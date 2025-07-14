<template>
  <Teleport
    to="body"
    v-if="is_open"
  >
    <div
      class="absolute top-0 left-0 w-screen h-screen z-50 bg-black/10 shadow-lg"
      @click="$main.toggleModal"
    >
      <div
        @click.stop
        class="bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-lg max-w-[95%] max-h-[95%] flex flex-col"
        :class="class_modal"
      >
        <header
          v-if="$slots.header"
          @click.stop
          class="flex-shrink-0 flex items-center justify-between gap-2 relative"
        >
          <h2
            :class="class_header"
            class="text-lg font-medium flex-shrink-0 w-full"
          >
            <slot name="header" />
          </h2>
          <button
            @click="$main.toggleModal"
            :class="class_close"
            class="p-1 absolute right-0"
          >
            <XMarkIcon class="size-5" />
          </button>
        </header>
        <section
          v-if="$slots.body"
          @click.stop
          :class="class_body"
          class="flex-grow overflow-y-auto"
        >
          <slot name="body" />
        </section>
        <footer
          v-if="$slots.footer"
          @click.stop
          :class="class_footer"
          class="flex-shrink-0"
        >
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useEventListener, type Fn } from '@vueuse/core'

import { XMarkIcon } from '@heroicons/vue/24/solid'

const $props = withDefaults(
  defineProps<{
    /**class cho modal */
    class_modal?: string
    /**class cho header */
    class_header?: string
    /**class cho close button */
    class_close?: string
    /**class cho body */
    class_body?: string
    /**class cho footer */
    class_footer?: string
  }>(),
  {}
)

/**ref của modal */
// const ref_modal = ref<HTMLDialogElement>()
/**ẩn hiện modal */
const is_open = ref(false)

class Main {
  /**hủy lắng nghe sự kiện nhấn phím */
  private clearEventListener?: Fn

  /**ẩn hiển modal */
  toggleModal() {    
    // nếu modal đang mở thì đóng
    if (is_open.value) {
      // đóng modal
      is_open.value = false

      // gọi hàm khi modal đóng
      this.onModalClose()
    }
    // nếu modal đang đóng thì mở
    else {
      // mở modal
      is_open.value = true

      // gọi hàm khi modal mở
      this.onModalOpen()
    }
  }
  /**xử lý sự kiện khi nhấn phím */
  handleKeyDown($event: KeyboardEvent) {
    // nếu nhấn phím ESC thì đóng modal
    if ($event.key === 'Escape') this.toggleModal()
  }
  /**lắng nghe sự kiện khi modal mở */
  onModalOpen() {
    // lắng nghe sự kiện nhấn phím
    this.clearEventListener = useEventListener(
      document,
      'keydown',
      this.handleKeyDown.bind(this)
    )
  }
  /**lắng nghe sự kiện khi modal đóng */
  onModalClose() {
    // hủy lắng nghe sự kiện nhấn phím
    this?.clearEventListener?.()
  }
}
const $main = new Main()

defineExpose({ toggleModal: $main.toggleModal.bind($main) })
</script>
