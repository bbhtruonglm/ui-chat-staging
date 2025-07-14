<template>
  <MenuItem
    @click="radio_ref?.click()"
    :icon="icon"
    :title="title"
  >
    <Radio
      ref="radio_ref"
      v-model="model"
      :value="value"
    />
  </MenuItem>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import MenuItem from '@/components/Main/Dashboard/MenuItem.vue'
import Radio from '@/components/Radio.vue'

import type { Component } from 'vue'

const $props = withDefaults(
  defineProps<{
    /**icon của item */
    icon: Component
    /**title của item */
    title: string
    /**giá trị của radio này */
    value?: string
  }>(),
  {}
)

/** Khai báo v-model */
const model = defineModel<any>()

/**ref của input radio */
const radio_ref = ref<InstanceType<typeof Radio>>()
</script>
