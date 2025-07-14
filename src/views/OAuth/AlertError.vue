<template>
  <Alert
    v-if="oAuthStore.error_message"
    type="error"
  >
    {{ oAuthStore.error_message }}
  </Alert>
</template>
<script setup lang="ts">
import { useOAuthStore } from './store'

import Alert from '@/views/OAuth/Alert.vue'

const oAuthStore = useOAuthStore()
</script>
