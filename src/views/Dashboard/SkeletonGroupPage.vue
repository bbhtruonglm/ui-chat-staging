<template>
  <div class="rounded-lg flex gap-3 py-3 px-4 bg-white">
    <div class="size-5 rounded-full bg-slate-200 animate-pulse" />
    <div class="flex-auto flex flex-col gap-3">
      <div class="flex py-0.5">
        <div class="animate-pulse rounded h-4 w-40 bg-slate-200" />
      </div>
      <div class="grid grid-cols-4 gap-y-3 gap-x-6">
        <div
          v-for="i of 6"
          class="rounded-lg flex items-center p-2 gap-2 border border-slate-200"
        >
          <div class="animate-pulse size-8 bg-slate-200 rounded-oval" />
          <div class="animate-pulse flex-auto flex flex-col gap-1">
            <span class="w-full h-4 rounded bg-slate-200" />
            <span class="w-28 h-3 rounded bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
