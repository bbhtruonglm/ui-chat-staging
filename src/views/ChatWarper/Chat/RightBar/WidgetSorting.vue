<template>
  <section class="flex flex-col gap-3 text-sm">
    <p class="font-semibold flex items-center">
      <i18n-t keypath="Kéo thả biểu tượng _ để sắp xếp lại vị trí">
        <template #icon>
          <GripVerticalIcon class="w-5 h-5 text-slate-700" />
        </template>
      </i18n-t>
      :
    </p>
    <div
      v-if="is_loading"
      class="relative"
    >
      <div class="absolute left-1/2 -translate-x-1/2">
        <Loading
          class="mx-auto"
        />
      </div>
    </div>
    <div
      v-show="!is_loading"
      class="flex flex-col gap-3"
    >
      <draggable
        class="flex gap-2 flex-col"
        v-model="pageStore.widget_list"
        group="people"
        @start="true"
        @end="false"
        item-key="_id"
      >
        <template #item="{ element }">
          <div
            class="flex items-center gap-3 bg-white rounded-md py-2.5 px-3 hover:bg-slate-100 cursor-move"
          >
            <GripVerticalIcon class="w-5 h-5 text-slate-700" />
            <p class="font-semibold">{{ element.snap_app?.name }}</p>
          </div>
        </template>
      </draggable>
      <button
        @click="$main.updateWidgetPostition()"
        class="w-fit py-2 px-4 rounded-md bg-blue-700 text-white font-medium"
      >
        {{ $t('Áp dụng') }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import draggable from 'vuedraggable'
import { usePageStore } from '@/stores'

import Loading from '@/components/Loading.vue'

import GripVerticalIcon from '@/components/Icons/GripVertical.vue'
import { eachOfLimit } from 'async'
import { loadingV2 } from '@/utils/decorator/Loading'
import { error } from '@/utils/decorator/Error'
import type { AppInstalledInfo } from '@/service/interface/app/widget'
import { update_widget } from '@/service/api/chatbox/n5-app'

/** props */
const $props = defineProps({
  /** hàm trở về màn danh sách */
  backToList: {
    type: Function,
    required: true,
  },
})

/** store */
const pageStore = usePageStore()

/** i18n */
const { t } = useI18n()

/** đang call api lưu */
const is_loading = ref(false)

class Main {
  constructor() {}
  /** Update lại vị trí của các widget */
  @loadingV2(is_loading, 'value')
  @error()
  async updateWidgetPostition() {
    // call api với 5 widget một lần
    await eachOfLimit(
      pageStore.widget_list,
      5,
      async (widget: AppInstalledInfo, index) => {
        /** index của widget */
        const INDEX = Number(index)

        /** cập nhật vị trí */
        widget.index_position = INDEX

        await new Promise((resolve, reject) => {
          update_widget(
            {
              _id: widget._id || '',
              index_position: INDEX,
            },
            (err, res) => {
              if (err) reject(err)
              else resolve(res)
            }
          )
        })
      }
    )

    // hàm trở về màn danh sách
    $props.backToList()
  }
}
const $main = new Main()
</script>
