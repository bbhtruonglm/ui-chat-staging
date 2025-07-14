<template>
    <Modal @close_modal="clearComponent" ref="attachment_view_modal_ref">
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.chat.message.attachment.title') }}
        </template>
        <template v-slot:body>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 h-[400px]">
                <div class="xl:col-span-2 h-[200px] md:h-full">
                    <div v-if="messageStore.select_attachment?.type === 'image'" :style="{
                        'background-image': `url(${messageStore.select_attachment?.payload?.url})`
                    }" class="w-full h-full bg-no-repeat bg-center bg-origin-content bg-contain border rounded-lg" />
                    <video v-else-if="messageStore.select_attachment?.type === 'video'" controls autoplay
                        class="h-full w-full">
                        <source :src="messageStore.select_attachment?.payload?.url">
                    </video>
                    <audio v-else-if="messageStore.select_attachment?.type === 'audio'" controls autoplay class="w-full">
                        <source :src="messageStore.select_attachment?.payload?.url">
                    </audio>
                    <div v-else class="w-full h-full flex flex-col justify-center items-center">
                        <img src="@/assets/icons/file.svg" class="w-[200px] h-[200px]" />
                        <div>{{ getFileName(messageStore.select_attachment?.payload?.url) }}</div>
                    </div>
                </div>
                <div>
                    <div class="flex justify-center mt-2">
                        <button @click="downloadFile" class="text-white bg-green-500 py-1 px-4 rounded-lg mr-2">
                            ↓ {{ $t('v1.common.download') }}
                        </button>
                        <button v-if="messageStore.select_attachment?.type === 'image'" @click="imageToText"
                            :class="{ 'bg-orange-300': is_loading }"
                            class="text-white bg-orange-500 py-1 px-4 rounded-lg relative">
                            📃{{ $t('v1.view.main.dashboard.chat.message.attachment.image_to_text') }}
                            <div v-if="is_loading"
                                class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                                <Loading />
                            </div>
                        </button>
                    </div>
                    <div v-if="messageStore.select_attachment?.type === 'image'"
                        class="h-[150px] md:h-[360px] overflow-y-auto p-2 mt-2 text-slate-500 break-words whitespace-pre-line">
                        {{ text }}
                    </div>
                </div>
            </div>
        </template>
    </Modal>
</template>
<script setup lang="ts">
import { useMessageStore } from '@/stores'
import { ref, watch } from 'vue'
import { size } from 'lodash'
import { getFileName } from '@/service/helper/queryString'

import Modal from '@/components/Modal.vue'
import Loading from '@/components/Loading.vue'

import type { ComponentRef } from '@/service/interface/vue'
import { toastError } from '@/service/helper/alert'
import { openNewTab } from '@/service/function'

const messageStore = useMessageStore()

/**ref của modal xem chi tiết file */
const attachment_view_modal_ref = ref<ComponentRef>()
/**văn bản được chuyển thể */
const text = ref('')
/**gắn cờ loading */
const is_loading = ref(false)

watch(() => messageStore.select_attachment, attachment => {
    if (!attachment || !size(attachment)) return

    attachment_view_modal_ref.value?.toggleModal()
})

/**xoá dữ liệu của component này */
function clearComponent() {
    // xoá dữ liệu store được lưu
    messageStore.select_attachment = undefined

    // xoá ocr
    text.value = ''
}
/**tải về tập tin */
function downloadFile() {
    const URL = messageStore.select_attachment?.payload?.url

    if (!URL) return

    openNewTab(URL)
}
/**chuyển đổi hình ảnh thành văn bản */
function imageToText() {
    if (is_loading.value) return

    if (!messageStore.select_attachment?.payload?.url) return

    is_loading.value = true

    // image_to_text(messageStore.select_attachment?.payload?.url, (e, r) => {
    //     is_loading.value = false

    //     if (e) return toastError(e)

    //     text.value = r
    // })
}
</script>