<template>
  <div
    v-if="$emotion.isValidEmotion(emotion)"
    v-tooltip="$t(`v1.view.main.dashboard.chat.message.emotion_ai.${emotion}`)"
    :class="{
      '-right-2.5': position === 'RIGHT',
      '-left-2.5': position === 'LEFT',
      'border-green-500 bg-green-100': is_positive,
      'border-red-500 bg-red-100': !is_positive,
      block: is_highlight,
      'hidden group-hover:flex': !is_highlight,
    }"
    class="border rounded-full w-6 h-6 flex items-center justify-center text-sm absolute -top-2.5 z-20"
  >
    {{ $emotion.getIcon(emotion) }}
  </div>
</template>
<script setup lang="ts">
import { Emotion } from '@/utils/helper/Emotion'
import { computed } from 'vue'

import type { MessageInfo } from '@/service/interface/app/message'
import { container } from 'tsyringe'

const $props = withDefaults(
  defineProps<{
    /**cảm xúc */
    emotion: string
    /**vị trí của cảm xúc */
    position: 'LEFT' | 'RIGHT'
    /**loại tin nhắn */
    message_type?: MessageInfo['message_type']
  }>(),
  {}
)

const $emotion = container.resolve(Emotion)

/**cảm xúc có tích cực không */
const is_positive = computed(() => $emotion.isPositive($props.emotion))
/**có phải là cảm xúc cần nêu bật không */
const is_highlight = computed(() =>
  $emotion.isHighlightInMess($props.emotion, $props.message_type)
)
</script>
