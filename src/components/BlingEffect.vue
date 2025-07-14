<template>
  <div class="relative">
    <slot></slot>
    <div v-if="show_effect" class="bg-black/20 absolute top-0 left-0 w-full h-full">
      <DotLottieVue
        src="https://lottie.host/6bfe6f47-cf28-43cf-a818-8e2d861d2d09/ORDprTQWtP.lottie"
        background="black"
        speed="1"
        :style="style"
        loop
        autoplay
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

const $props = defineProps({
  style: {
    type: String,
    default: 'width: 40px; height: 40px'
  },
  show_effect: {
    type: Boolean,
    default: false
  }
})
</script>
