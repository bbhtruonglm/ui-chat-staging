<template>
    <div class="h-[90px] md:h-[64px] rounded-t-[35px] md:rounded-none pt-4 md:pt-[10px] xl:pt-4 px-[40px]">
        <div>
            <button @click="onClick()" :disabled="disabled"
                :class="!disabled ? 'bg-orange-600 hover:bg-orange-500' : 'bg-slate-600 hover:bg-slate-500'"
                class="w-full rounded-full py-1 text-white flex justify-center items-center  mx-auto md:w-[300px]">
                {{ text }}
                <div v-if="count"
                    class="text-xs text-orange-600 bg-white rounded-full w-[19px] h-[19px] flex justify-center items-center ml-2">
                    {{ count }}
                </div>
            </button>
        </div>
    </div>
</template>
<script setup lang="ts">
const $emit = defineEmits(['click_btn'])

withDefaults(defineProps<{
    /**vô hiệu hoá button */
    disabled?: boolean
    /**hiển thị số đếm */
    count?: number
    /**nội dung của button */
    text: string
}>(), {})

/**gửi event click btn ra bên ngoài */
function onClick() {
    $emit('click_btn')
}
</script>