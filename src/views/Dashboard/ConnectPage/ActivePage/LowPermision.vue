<template>
  <div class="flex flex-col justify-center items-center gap-2.5 h-full">
    <div class="p-4 bg-gray-100 rounded-full">
      <LockIcon class="w-7 h-7 text-slate-700" />
    </div>
    <div class="font-semibold">
      {{ $t('v1.view.main.dashboard.select_platform.no_access') }}
    </div>
    <div class="text-sm text-slate-700 text-center w-[405px]">
      {{ $t('v1.view.main.dashboard.select_platform.not_admin') }}
    </div>
  </div>
</template>
<script setup lang="ts">
import LockIcon from '@/components/Icons/Lock.vue'
</script>
