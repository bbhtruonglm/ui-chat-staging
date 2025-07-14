<template>
  <div class="relative">
    <input
      v-model="password"
      @keyup.enter="$emit('enter')"
      autocapitalize="off"
      autocorrect="off"
      :type="is_visible ? 'text' : 'password'"
      :placeholder
      class="custom-input !pr-7"
    />
    <button
      @click="is_visible = !is_visible"
      class="w-4 h-4 absolute top-1/2 right-2 -translate-y-1/2"
    >
      <EyeIcon
        v-if="!is_visible"
        class="text-gray-500"
      />
      <EyeSlashIcon
        v-else
        class="text-gray-500"
      />
    </button>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid'

const $emit = defineEmits(['enter'])

const $props = withDefaults(
  defineProps<{
    /**mô hình */
    placeholder?: string
  }>(),
  {}
)

/**mật khẩu */
const password = defineModel()

/**Hiện mật khẩu */
const is_visible = ref(false)
</script>
<style scoped lang="scss">
@import './index.scss';
</style>
