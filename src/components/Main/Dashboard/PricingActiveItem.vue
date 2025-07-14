<template>
    <div class="bg-slate-100 rounded p-1 flex items-center cursor-pointer">
        <div>
            <PageAvatar v-if="page_data" 
                :page_info="page_data?.page" class="rounded-full w-10 h-10" />
            <StaffAvatar class="rounded-full w-10 h-10" v-if="staff_data" :id="staff_data?.fb_staff_id" />
        </div>
        <div class="ml-1 w-[calc(100%_-_60px)] pr-1">
            <div class="truncate">
                <span v-if="page_data">{{ page_data?.page?.name }}</span>
                <span v-if="staff_data">{{ staff_data?.name }}</span>
            </div>
            <div class="text-sm text-slate-500 truncate">
                <span v-if="page_data">{{ page_data?.page?.fb_page_id }}</span>
                <span v-if="staff_data">{{ staff_data?.fb_staff_id }}</span>
            </div>
        </div>
        <div class="h-full">
            <input :disabled="checkDisableCheckbox()" type="checkbox" class="w-[15px] h-[15px] accent-orange-600"
                :checked="checkDisableCheckbox() || page_data?.is_select || staff_data?.is_select" />
        </div>
    </div>
</template>
<script setup lang="ts">
import PageAvatar from '@/components/Avatar/PageAvatar.vue'
import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'

import type { SelectPageData } from '@/service/interface/app/page'
import type { SelectStaffData } from '@/service/interface/app/staff'

const $props = withDefaults(defineProps<{
    /**data của page */
    page_data?: SelectPageData
    /**data của nhân viên */
    staff_data?: SelectStaffData
    /**id của gói hiện tại */
    pricing_id?: string
}>(), {})

/**không cho chỉnh sửa các item đã được kích hoạt ở gói khác gói hiện tại */
function checkDisableCheckbox() {
    return !!(
        (
            $props.page_data?.page?.pricing_id &&
            $props.pricing_id !== $props.page_data?.page?.pricing_id
        ) ||
        (
            $props.staff_data?.pricing_id &&
            $props.pricing_id !== $props.staff_data.pricing_id
        )
    )
}
</script>