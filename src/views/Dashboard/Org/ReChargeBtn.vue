<template>
  <button
    @click="$router.push('/dashboard/org/pay/recharge')"
    class="rounded flex items-center gap-1 hover:brightness-90 text-sm font-semibold py-2 px-4 bg-blue-600 text-white"
  >
    <VndPlusIcon class="w-4 h-4" />
    {{ $t('v1.view.main.dashboard.org.recharge') }}
  </button>
</template>
<script setup lang="ts">
import VndPlusIcon from '@/components/Icons/VndPlus.vue'
</script>
