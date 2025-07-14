<template>
  <div class="p-2 flex items-center gap-2 hover:bg-slate-100 rounded-lg group">
    <div class="flex-shrink-0">
      <slot name="before-avatar" />
    </div>
    <div class="flex-shrink-0">
      <slot name="avatar" />
    </div>
    <div class="w-full min-w-0">
      <div class="flex items-center gap-2">
        <div class="flex-grow min-w-0 flex gap-1 items-center">
          <slot name="before-name" />
          <div class="flex-grow min-w-0 word-break-break-word">
            <slot name="name" />
          </div>
        </div>
        <div class="flex-shrink-0">
          <slot name="after-name" />
        </div>
      </div>
      <div class="flex items-center gap-1">
        <slot name="description" />
      </div>
    </div>
  </div>
</template>