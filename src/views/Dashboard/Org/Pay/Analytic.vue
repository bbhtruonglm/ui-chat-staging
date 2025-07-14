<template>
  <CardItem>
    <template #icon>
      <Stack3dIcon class="w-5 h-5" />
    </template>
    <template #title>
      {{ $t('v1.view.main.dashboard.org.pay.traffic_usage') }}
    </template>
    <template #item>
      <div class="flex flex-col gap-2.5">
        <div class="text-slate-500 text-sm font-medium">
          {{ $t('v1.view.main.dashboard.org.pay.traffic_usage_info') }}
        </div>
        <div class="flex items-center justify-center">
          <img src="@/assets/imgs/demo_ai_1.png" class="min-w-0" />
          <img src="@/assets/imgs/demo_ai_2.png" class="w-64" />
        </div>
      </div>
    </template>
  </CardItem>
</template>
<script setup lang="ts">
import CardItem from '@/components/Main/Dashboard/CardItem.vue'

import Stack3dIcon from '@/components/Icons/Stack3d.vue'
</script>
