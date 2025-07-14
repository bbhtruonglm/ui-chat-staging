<template>
  <div
    v-tooltip.bottom="$t('Trợ lý AI')"
    class="flex flex-col items-end"
    :class="{
      'text-slate-400': !is_enable,
    }"
  >
    <div class="flex items-center gap-1">
      <SparklesIcon class="size-4" />
      <Toggle
        v-model="is_enable"
        :class_toggle="`peer-checked:bg-black !h-4 !w-7 after:!h-3 after:!w-3 ${
          ai_agent_working_hour_answer?.type === 'NOT_ANSWER' &&
          'cursor-not-allowed'
        }`"
        :disabled="ai_agent_working_hour_answer?.type === 'NOT_ANSWER'"
      />
    </div>
    <p class="text-xxs leading-3">{{ getAiAgentStatus?.() }}</p>
  </div>
</template>
<script setup lang="ts">
import Toggle from '@/components/Toggle.vue'

import { SparklesIcon } from '@heroicons/vue/24/solid'

import { composableService } from '@/views/ChatWarper/Chat/CenterContent/UserInfo/ChatbotStatus/service'

const { is_enable, ai_agent_working_hour_answer, getAiAgentStatus } =
  composableService()
</script>
