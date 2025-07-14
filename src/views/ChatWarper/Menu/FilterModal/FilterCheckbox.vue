<template>
  <MenuItem
    @click="checkbox_ref?.click()"
    :icon="icon"
    :title="title"
  >
    <Checkbox
      ref="checkbox_ref"
      v-model="model"
      :true_value="true_value"
      :false_value="false_value"
    />
  </MenuItem>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import MenuItem from '@/components/Main/Dashboard/MenuItem.vue'
import Checkbox from '@/components/Checkbox.vue'

import type { Component } from 'vue'

const $props = withDefaults(
  defineProps<{
    /**icon của item */
    icon: Component
    /**title của item */
    title: string
    /**giá trị đúng của checkbox này */
    true_value?: any
    /**giá trị sai của checkbox này */
    false_value?: any
  }>(),
  {}
)

/** Khai báo v-model */
const model = defineModel<any>()

/**ref của radio button */
const checkbox_ref = ref<InstanceType<typeof Checkbox>>()
</script>
