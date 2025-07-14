<template>
    <Modal ref="install_widget_ref">
        <template v-slot:header>
            <div class="flex items-center">
                <object :data="widget?.snap_app?.icon" type="image/png" class="w-[20px] h-[20px]">
                    <img src="@/assets/imgs/chatbox.svg" class="w-[20px] h-[20px]" />
                </object>
                <div class="ml-1">
                    {{ widget?.snap_app?.name }}
                </div>
            </div>
        </template>
        <template v-slot:body>
            <div
                class="h-[calc(100vh_-_217px)] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-x-5">
                <div>
                    <Title :title="$t('v1.view.main.dashboard.widget.role')" />
                    <div>
                        <Role :access_role_select="access_role_select" @update="$event => access_role_select = $event" />
                    </div>
                </div>
                <div>
                    <Title :title="$t('v1.view.main.dashboard.widget.position')" />
                    <div class="mt-1 grid grid-cols-2">
                        <div @click="position = 'RIGHT'" class="flex items-center cursor-pointer">
                            <input v-model="position" value="RIGHT" type="radio"
                                class="accent-orange-600 w-[20px] h-[20px]">
                            <div class="ml-2">
                                {{ $t('v1.view.main.dashboard.widget.position_list.right') }}
                            </div>
                        </div>
                        <div @click="position = 'BOTTOM'" class="flex items-center cursor-pointer">
                            <input v-model="position" value="BOTTOM" type="radio"
                                class="accent-orange-600 w-[20px] h-[20px]">
                            <div class="ml-2">
                                {{ $t('v1.view.main.dashboard.widget.position_list.bottom') }}
                            </div>
                        </div>
                    </div>
                    <Title :title="$t('v1.view.main.dashboard.widget.size')" />
                    <div class="mt-1 grid grid-cols-3">
                        <div @click="size = 'MINIMUM'" class="flex items-center cursor-pointer">
                            <input v-model="size" value="MINIMUM" type="radio" class="accent-orange-600 w-[20px] h-[20px]">
                            <div class="ml-2">
                                {{ $t('v1.view.main.dashboard.widget.size_list.small') }}
                            </div>
                        </div>
                        <div @click="size = 'MEDIUM'" class="flex items-center cursor-pointer">
                            <input v-model="size" value="MEDIUM" type="radio" class="accent-orange-600 w-[20px] h-[20px]">
                            <div class="ml-2">
                                {{ $t('v1.view.main.dashboard.widget.size_list.medium') }}
                            </div>
                        </div>
                        <div @click="size = 'FULL'" class="flex items-center cursor-pointer">
                            <input v-model="size" value="FULL" type="radio" class="accent-orange-600 w-[20px] h-[20px]">
                            <div class="ml-2">
                                {{ $t('v1.view.main.dashboard.widget.size_list.big') }}
                            </div>
                        </div>
                    </div>
                    <Title :title="$t('v1.view.main.dashboard.widget.staff_group')" />
                    <div class="mt-1 grid grid-cols-3 gap-y-2">
                        <div @click="group_staff_refs?.[group_staff._id]?.click()" v-for="group_staff of group_staff_list"
                            class="flex items-center cursor-pointer">
                            <input :ref="setGroupStaffRef(group_staff._id)" v-model="group_staff_id_list"
                                :value="group_staff._id" type="checkbox" class="accent-orange-600 w-[20px] h-[20px]">
                            <div class="ml-2">
                                {{ group_staff.name }}
                            </div>
                        </div>
                    </div>
                    <Title :title="$t('v1.view.main.dashboard.widget.special')" />
                    <div class="mt-1 grid grid-cols-3 gap-y-2">
                        <div @click="is_hide_pc = !is_hide_pc" class="flex items-center cursor-pointer">
                            <input v-model="is_hide_pc" type="checkbox" class="accent-orange-600 w-[20px] h-[20px]">
                            <div class="ml-2">
                                {{ $t('v1.view.main.dashboard.widget.special_list.hide_pc') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <div class="grid grid-cols-2 gap-2">
                <FilterButton @click="toggleModal" type="text-slate-500 hover:text-white hover:bg-slate-500"
                    :title="$t('v1.common.cancel')" />
                <FilterButton @click="updateWidget"
                    type="border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500"
                    :title="$t('v1.common.update')" />
            </div>
        </template>
    </Modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { watch } from 'vue'
import { map, set } from 'lodash'
import { update_widget } from '@/service/api/chatbox/n5-app'
import { flow } from '@/service/helper/async'
import { reactive } from 'vue'

import Modal from '@/components/Modal.vue'
import FilterButton from '@/views/ChatWarper/Menu/FilterModal/FilterButton.vue'
import Title from '@/views/Dashboard/Widget/Title.vue'
import Role from '@/views/Dashboard/Widget/Role.vue'

import type { ComponentRef } from '@/service/interface/vue'
import type { AppInstalledInfo, AppInstalledPosition, AppInstalledSize, AccessRoleInfo } from '@/service/interface/app/widget'
import type { GroupStaffInfo } from '@/service/interface/app/page'
import type { CbError } from '@/service/interface/function'
import { toast } from '@/service/helper/alert'

const $emit = defineEmits(['update_widget'])

const $props = withDefaults(defineProps<{
    /**giá trị widget đang chọn */
    widget?: AppInstalledInfo
    /**nhóm các nhân viên của trang */
    group_staff_list?: GroupStaffInfo[]
}>(), {})

const $t = useI18n().t

/**các quyền có thể cài đặt */
const access_role_select = ref<AccessRoleInfo>({})
/**ref của modal */
const install_widget_ref = ref<ComponentRef>()
/**vị trí hiển thị của app */
const position = ref<AppInstalledPosition>('RIGHT')
/**kích cỡ */
const size = ref<AppInstalledSize>('MEDIUM')
/**thiết lập ẩn trên máy tính */
const is_hide_pc = ref(false)
/**danh sách id cac nhóm nhân viên của trang đang chọn */
const group_staff_id_list = ref<string[]>([])
/**ref động của các checkbox group staff */
const group_staff_refs = reactive<any>({})

watch(() => $props.widget, () => setDefaultValueSetting())

/**tạo ra các ref động */
const setGroupStaffRef = (id: string) => (el: any) => {
    if (el) group_staff_refs[id] = el
}
/**cài đặt widget */
function updateWidget() {
    if (!$props.widget?._id) return

    /**body để update */
    let body: {} = {}
    flow([
        // * khởi tạo body
        (cb: CbError) => {
            body = {
                _id: $props.widget?._id as string,
                position: position.value,
                app_installed_size: size.value,
                access_group: group_staff_id_list.value,
                access_role_select: access_role_select.value,
                hide_pc: is_hide_pc.value
            }

            cb()
        },
        // * gọi api cập nhật
        (cb: CbError) => update_widget({
            _id: $props.widget?._id as string,
            position: position.value,
            app_installed_size: size.value,
            access_group: group_staff_id_list.value,
            access_role_select: access_role_select.value,
            hide_pc: is_hide_pc.value
        }, (e, r) => {
            if (e) return cb(e)

            $emit('update_widget', body)
            cb()
        }),
        // * thông báo thành công
        (cb: CbError) => {
            toast('success', $t('v1.common.update_success'))

            cb()
        }
    ], undefined, true)
}
/**thiết lập các cài đặt mặc định cho widget */
function setDefaultValueSetting() {
    // cài đặt mặc định các quyền mà widget yêu cầu
    map($props.widget?.access_role_select, (is_active, role) => {
        // bỏ qua id record mongo
        if (role === '_id') return

        // mapping kích hoạt role
        set(access_role_select.value, [role], is_active)

        // vị trí
        if ($props.widget?.position)
            position.value = $props.widget?.position

        // kích thước
        if ($props.widget?.app_installed_size)
            size.value = $props.widget?.app_installed_size

        // ẩn pc
        if ($props.widget?.hide_pc)
            is_hide_pc.value = $props.widget?.hide_pc

        // nhóm nhân viên
        if ($props.widget?.access_group)
            group_staff_id_list.value = $props.widget?.access_group
    })
}
/**mở modal của pricing detail */
function toggleModal() {
    install_widget_ref.value.toggleModal()
}

defineExpose({ toggleModal })
</script>