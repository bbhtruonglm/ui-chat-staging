<template>
  <OAuthV2>
    <strong class="custom-title">
      {{ $t('Bắt đầu Chat ngay với Retion!') }}
    </strong>
    <p class="text-sm">
      {{
        $t(
          'Để bắt đầu trò chuyện trên Trang này, vui lòng tải ứng dụng Retion.'
        )
      }}
      <br />
      {{
        $t(
          'Ứng dụng giúp bạn có trải nghiệm tuyệt vời khi quản lý hội thoại và tương tác với khách hàng nhanh chóng, tiện lợi.'
        )
      }}
    </p>
    <p class="text-sm">
      {{ $t('Tải ngay ứng dụng cho iOS hoặc Android:') }}
    </p>
    <div class="grid grid-cols-2 gap-5">
      <a
        href="https://apps.apple.com/vn/app/retion/id6624302624"
        target="_blank"
        rel="noopener noreferrer"
        class="flex justify-end"
      >
        <img src="@/assets/imgs/app-store.png" />
      </a>
      <a
        href="https://play.google.com/store/apps/details?id=ai.retion.app&pli=1"
        target="_blank"
        rel="noopener noreferrer"
        class="flex justify-start"
      >
        <img src="@/assets/imgs/google-play.png" />
      </a>
    </div>
  </OAuthV2>
</template>
<script setup lang="ts">
import { useCommonStore } from '@/stores'

import OAuthV2 from '@/views/OAuthV2.vue'

const commonStore = useCommonStore()
</script>
<style scoped lang="scss">
@import './OAuth/index.scss';
</style>
