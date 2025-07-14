<template>
  <div class="text-xs text-center">
    <span class="text-slate-500 whitespace-nowrap mr-1">
      {{ $t('v1.view.main.dashboard.chat.post.ad_from') }}
    </span>
    <span class="text-blue-500">{{ $props.ad_id }}</span>
  </div>
  <FacebookPost
    ref="fb_post_ref"
    :ad_id="$props.ad_id"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

import FacebookPost from '@/views/ChatWarper/Chat/CenterContent/MessageList/FacebookPost.vue'

const $props = withDefaults(
  defineProps<{
    ad_id: string
  }>(),
  {}
)

/**ref của tin nhắn dạng post */
const fb_post_ref = ref<InstanceType<typeof FacebookPost>>()
</script>
