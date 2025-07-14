<template>
    <div class="h-full overflow-y-auto pb-5">
        <div class="flex justify-center">
            <button @click="upsert_widget_ref?.toggleModal()"
                class="bg-white md:bg-slate-100 flex items-center rounded-full py-1 pr-2 border">
                <img src="@/assets/icons/add-circle.svg" />
                <div class="text-slate-500">
                    {{ $t('v1.view.main.dashboard.widget.create.title') }}
                </div>
            </button>
        </div>
        <Title v-if="widget_list?.filter(widget => widget?.status === 'APPROVED')?.length"
            :title="$t('v1.view.main.dashboard.widget.create.public')" />
        <div :class="{ 'md:grid-cols-3 xl:grid-cols-4': commonStore.dashboard_toggle_nav }"
            class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 xl:grid-cols-3">
            <template v-for="widget of widget_list">
                <Item disable_delete @delete="deleteWidget(widget)" @click="settingWidget(widget)" @setting="settingWidget(widget)"
                    @tranfer="tranferWidget(widget)" @install="installWidget(widget)" @key="copyKeyWidget(widget)"
                    v-if="widget?.status === 'APPROVED'" :widget="widget" is_control is_owner_control >
                    <div class="flex items-center gap-2">
                        <KeyIcon class="size-4" @click.stop="copyKeyWidget(widget)" />
                        <ArrowDownCircleIcon class="size-4" @click.stop="installWidget(widget)" />
                    </div>
                </Item>
            </template>
        </div>
        <Title v-if="widget_list?.filter(widget => widget?.status === 'PRIVATE')?.length"
            :title="$t('v1.view.main.dashboard.widget.create.private')" />
        <div :class="{ 'md:grid-cols-3 xl:grid-cols-4': commonStore.dashboard_toggle_nav }"
            class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 xl:grid-cols-3">
            <template v-for="widget of widget_list">
                <Item @delete="deleteWidget(widget)" @click="settingWidget(widget)" @setting="settingWidget(widget)" @tranfer="tranferWidget(widget)"
                    @install="installWidget(widget)" @key="copyKeyWidget(widget)" v-if="widget?.status === 'PRIVATE'"
                    :widget="widget" is_control is_owner_control >
                    <div class="flex items-center gap-2">
                        <KeyIcon class="size-4" @click.stop="copyKeyWidget(widget)" />
                        <ArrowDownCircleIcon class="size-4" @click.stop="installWidget(widget)" />
                    </div>
                </Item>
            </template>
        </div>
        <Title v-if="widget_list?.filter(widget => widget?.status === 'REJECT')?.length"
            :title="$t('v1.view.main.dashboard.widget.create.disable')" />
        <div :class="{ 'md:grid-cols-3 xl:grid-cols-4': commonStore.dashboard_toggle_nav }"
            class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 xl:grid-cols-3">
            <template v-for="widget of widget_list">
                <Item @delete="deleteWidget(widget)" @click="settingWidget(widget)" @setting="settingWidget(widget)" @tranfer="tranferWidget(widget)"
                    @install="installWidget(widget)" @key="copyKeyWidget(widget)" v-if="widget?.status === 'REJECT'"
                    :widget="widget" is_control is_owner_control >
                    <div class="flex items-center gap-2">
                        <KeyIcon class="size-4" @click.stop="copyKeyWidget(widget)" />
                        <ArrowDownCircleIcon class="size-4" @click.stop="installWidget(widget)" />
                    </div>
                </Item>
            </template>
        </div>
    </div>
    <template>
        <UpsertWidget @reload="getMyWidget()" :widget="selected_widget" ref="upsert_widget_ref" />
        <!-- <InstallWidget ref="install_widget_ref" :widget="selected_widget" /> -->
        <TranferWidget @reload="getMyWidget()" ref="tranfer_widget_ref" :widget="selected_widget" />
    </template>
    <WidgetInfo ref="widget_info_ref" />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useCommonStore, useWidgetStore } from '@/stores'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { delete_my_widget } from '@/service/api/chatbox/n5-app'

import WidgetInfo from '@/views/Dashboard/Widget/WidgetInfo.vue'
import UpsertWidget from '@/views/Dashboard/Widget/UpsertWidget.vue'
import Title from '@/views/Dashboard/Widget/Title.vue'
import Item from '@/views/Dashboard/Widget/Item.vue'
// import InstallWidget from '@/views/Dashboard/Widget/InstallWidget.vue'
import TranferWidget from '@/views/Dashboard/Widget/TranferWidget.vue'

import type { ComponentRef } from '@/service/interface/vue'
import { get_market_widget } from '@/service/api/chatbox/n5-app'
import type { AppInfo } from '@/service/interface/app/widget'
import { waterfall } from 'async'
import type { CbError } from '@/service/interface/function'
import { confirm, toast, toastError } from '@/service/helper/alert'
import { toggle_loading } from '@/service/helper/async'
import { copyToClipboard } from '@/service/helper/copyWithAlert'
import { ArrowDownCircleIcon, KeyIcon } from '@heroicons/vue/24/solid'

const $emit = defineEmits(['is_loading'])

const $t = useI18n().t
const commonStore = useCommonStore()
const widgetStore = useWidgetStore()

/**ref của modal cài đặt widget */
const install_widget_ref = ref<ComponentRef>()
/**widget được chọn để cài đặt */
const selected_widget = ref<AppInfo>()
/**danh sách widget của chính mình */
const widget_list = ref<AppInfo[]>([])
/**ref của modal cài đặt widget */
const upsert_widget_ref = ref<ComponentRef>()
/**ref của modal chuyển nhượng widget */
const tranfer_widget_ref = ref<ComponentRef>()
/**ref của modal cài đặt widget */
const widget_info_ref = ref<ComponentRef>()

onMounted(() => getMyWidget())

/**đọc danh sách widget của chính mình */
function getMyWidget() {
    $emit('is_loading', true)

    get_market_widget({
        // user_created: '',
        skip: 0,
        limit: 200
    }, (e, r) => {
        $emit('is_loading', false)

        if (r) widget_list.value = r
    })
}
/**xoá widget */
function deleteWidget(widget: AppInfo) {
    waterfall([
        // * cảnh báo
        (cb: CbError) => confirm(
            'warning', 
            $t('v1.view.main.dashboard.widget.create.delete.title'),
            '',
            (e, r) => {
                if (e) return   

                cb()
            }
        ),
        // * loading
        (cb: CbError) => {
            toggle_loading(true)

            cb()
        },
        // * gọi api xoá
        (cb: CbError) => delete_my_widget(widget._id, (e, r) => {
            if (e) return cb(e)

            cb()
        })
    ], e => {
        toggle_loading(false)

        if (e) return toastError(e)

        getMyWidget()

        toast('success', $t('v1.view.main.dashboard.widget.create.delete.success'))
    })
}
/**chỉnh sửa thiết lập widget */
function settingWidget(widget: AppInfo) {
    selected_widget.value = widget

    upsert_widget_ref.value?.toggleModal()
}
/**chuyển nhượng widget */
function tranferWidget(widget: AppInfo) {
    selected_widget.value = widget
    
    tranfer_widget_ref.value?.toggleModal()
}
/**cài đặt widget cho trang */
function installWidget(widget: AppInfo) {
    // gán giá trị cho widget được chọn
    widgetStore.selected_widget = widget

    // mở modal
    widget_info_ref.value.toggleModal()

    // selected_widget.value = widget

    // install_widget_ref.value?.toggleModal()
}
/**sao chép mã bí mật của widget */
function copyKeyWidget(widget: AppInfo) {
    if (!widget?.secret_key) return

    copyToClipboard(
        widget?.secret_key, 
        $t('v1.view.main.dashboard.widget.create.copy_success')
    )
}
</script>