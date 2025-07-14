<template>
  <div class="flex items-center gap-2.5">
    <img
      :src
      class="h-full aspect-square rounded"
    />
    <button
      @click="$main.delete"
      class="btn btn-text bg-red-100 text-red-500"
    >
      {{ $t(`v1.common.delete`) }}
    </button>
    <button
      @click="$main.upload"
      class="btn bg-slate-100 h-9"
    >
      <ArrowUpCircleIcon class="w-4 h-4" />
      <span class="btn-text hidden md:block">
        {{ $t(`${THIS_I18N}.upload_logo`) }}
        (256 x 256)
      </span>
    </button>
  </div>
</template>
<script setup lang="ts">
import { UploadFile } from '@/utils/helper/Upload'
import { container } from 'tsyringe'
import { onMounted, ref, watch } from 'vue'

import ArrowUpCircleIcon from '@/components/Icons/ArrowUpCircle.vue'

/**đường dẫn đến thư mục chứa i18n của component này */
const THIS_I18N = 'v1.component.upload.avatar_upload'

const $emit = defineEmits<{
  /**xóa avt */
  delete: []
  /**lấy file hình ảnh mới */
  upload: [value: File | undefined]
}>()

/**v-model src: link ảnh avt hiện tại */
const src = defineModel<string>()

const $props = withDefaults(
  defineProps<{
    /**avt mặc định */
    default?: string
  }>(),
  {}
)

const $upload = container.resolve(UploadFile)

class Main {
  /**xóa ảnh hiện tại */
  delete() {
    // đặt lại thành ảnh mặc định
    src.value = $props.default

    // gửi sự kiện ra ngoài
    $emit('delete')
  }
  /**upload ảnh */
  upload() {
    // mở cửa sổ chọn file
    $upload.exec(
      // gửi file ra ngoài
      files => {
        /**file hình ảnh */
        const FILE = files?.[0]

        // nếu không có file thì thôi
        if (!FILE) return

        // tạo ra link ảnh dùng được ở src của thẻ img từ file
        src.value = URL.createObjectURL(FILE)

        // xuất file ra ngoài
        $emit('upload', FILE)
      },
      // chỉ cho chọn 1 file
      false,
      // chỉ chọn file ảnh
      'image/*'
    )
  }
  /**khởi tạo link avt */
  initSrc() {
    // nếu đã có avt thì thôi
    if (src.value) return

    // nếu lần đầu chưa có avt thì khởi tạo
    src.value = $props.default
  }
}
const $main = new Main()

// khi dữ liệu mặc định thay đổi, thì khởi tạo lại link avt nếu cần
watch(() => $props.default, $main.initSrc)
// nếu lần đầu chưa có avt, thì lấy logo mặc định
onMounted($main.initSrc)
</script>
<style lang="scss" scoped>
.btn {
  @apply py-2 px-4 flex items-center gap-2 rounded-md;
}
.btn-text {
  @apply text-sm font-medium;
}
</style>
