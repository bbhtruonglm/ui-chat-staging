<template>
    <Modal ref="installed_widgets_ref">
        <template v-slot:header>
            <div class="flex items-center">
                <div>{{ $t('v1.view.main.dashboard.widget.arrange') }}</div>
            </div>
        </template>
        <template v-slot:body>
            <div class="md:w-[500px] w-full">
                <draggable v-model="widgets_installed" group="people" @start="true" @end="false" item-key="_id">
                    <template #item="{ element }">
                        <div class="p-2 bg-slate-100 rounded-lg mb-1 flex items-end cursor-move">
                            <img class="w-5 mr-3" :src="element.snap_app?.icon" alt="">
                            {{ element.snap_app?.name }}
                        </div>
                    </template>
                </draggable>
            </div>
        </template>
        <template v-slot:footer>
            <div class="flex justify-end w-full mb-2">
                <button @click="updateWidgetPostition()" class="bg-orange-500 text-white px-3 py-1.5 rounded-lg">
                    {{ $t('v1.common.update') }}
                </button>
            </div>
        </template>
    </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
import { useI18n } from 'vue-i18n'
import { update_widget } from '@/service/api/chatbox/n5-app'
import { eachOfLimit } from 'async'

import Modal from '@/components/Modal.vue'

import type { ComponentRef } from '@/service/interface/vue'
import type { AppInstalledInfo } from '@/service/interface/app/widget'

const $props = withDefaults(defineProps<{
    /**giá trị widget đang chọn */
    widgets: AppInstalledInfo[]
}>(), {})

const $t = useI18n().t

/**ref của modal */
const installed_widgets_ref = ref<ComponentRef>()
/** Danh sách widget đã cài đặt */
const widgets_installed = ref<AppInstalledInfo[]>([])

/** Theo dõi sự thay đổi của props */
watch(() => $props.widgets, () => getWidgetsData(), { deep: true })

/**mở modal của pricing detail */
function toggleModal() {
    installed_widgets_ref.value.toggleModal()
}
/** Khi dữ liệu prop thay đổi thì update lại biến tạm */
function getWidgetsData() {

    // * Chỉ hiển thị những widget đang hoạt động
    widgets_installed.value = $props.widgets.filter(widget => {
        return widget.active_widget === true
    })

    // * Update lại ví trí widget trong mảng
    sortWidgetByIndexPosition()
}
/** Update lại vị trí của các widget */
function updateWidgetPostition() {

    // * Xử lý từng widget 1
    eachOfLimit(
        widgets_installed.value,
        1,
        (widget: AppInstalledInfo, index, next) => {

            // * Thay đổi lại index position của widet
            widget.index_position = index as number

            // * update lại widget thay đổi vị trí
            update_widget({
                _id: widget._id || '',
                index_position: index as number,
            }, (e, r) => {

                // * Chuyển qua xử lý widget tiếp theo
                next()
            })
        },
        e => {
            // * Tắt modal
            toggleModal()

            // * Update lại ví trí widget trong mảng
            sortWidgetByIndexPosition()
        }
    )
}
/** Update lại vị trí của các widget */
function sortWidgetByIndexPosition() {
    // * Sắp xếp vị trí widget từ trên xuống dưới
    widgets_installed.value = widgets_installed.value.sort((a, b) => {
        return (a?.index_position || 0) - (b?.index_position || 0)
    })
}

defineExpose({ toggleModal })
</script>