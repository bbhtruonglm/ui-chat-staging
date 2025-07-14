<template>
  <button class="btn-custom">
    <slot />
  </button>
</template>
<style scoped lang="scss">
.btn-custom {
  @apply py-2 px-4 rounded-md text-sm font-medium justify-between hover:brightness-90;
}
</style>
