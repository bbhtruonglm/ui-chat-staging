<template>
  <div class="bg-gray-100 flex items-center justify-center min-h-screen">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-sm">
      <h1 class="text-2xl font-semibold mb-4">Deauthorize Instagram</h1>
      <p class="text-gray-600 mb-6">
        You must accept permissions to connect Retion with Instagram.
      </p>
      <div class="flex flex-col items-center">
        <button
          @click="back"
          class="bg-red-600 text-white px-4 py-2 rounded-full w-full"
        >
          Back to authorize Instagram
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
/**quay lại trang trước đó nếu có */
function back() {
  window.history.back()
}
</script>
