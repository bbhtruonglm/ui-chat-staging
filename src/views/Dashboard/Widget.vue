<template>
  <div
    v-if="widgetStore.is_loading"
    class="absolute top-9 left-1/2 -translate-x-1/2 z-50"
  >
    <Loading />
  </div>
  <DashboardLayout class_content="flex flex-col gap-3 relative overflow-y-auto">
    <template #menu><Menu /></template>
    <template #content>
      <RouterView />
    </template>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { useWidgetStore } from '@/stores'

import Menu from '@/views/Dashboard/Widget/Menu.vue'
import DashboardLayout from '@/components/Main/Dashboard/DashboardLayout.vue'
import Loading from '@/components/Loading.vue'

const widgetStore = useWidgetStore()
</script>
