import { watch } from 'vue'
import { getItem, setItem } from '@/service/helper/localStorage'

import type { Ref } from 'vue'
import type { Cb } from '../interface/function'

/**lưu lại giá trị của store vào local, để khi f5 trang không bị mất */
export const saveLocal = (data: Ref<any>, name: string) => watch(
    () => data.value,
    () => setItem(name, data.value),
    { deep: true }
)

/**load lại giá trị đã được lưu local vào store, khi trang được load */
export const getLocal = (name: string, default_value: any) => {
    /**lấy giá trị từ local */
    const VALUE = getItem(name)

    // nếu không có giá trị thì trả về giá trị mặc định
    if (VALUE === null || VALUE === undefined) return default_value

    // nếu có giá trị thì trả về giá trị đó
    return VALUE
}

/**lưu lại giá trị của store vào indexedDB, để khi f5 trang không bị mất */
export const saveIndexedDB = (data: Ref<any>, key: string) => watch(
    () => data.value,
    () => $indexed_db.set(key, data.value, (e, r) => { }),
    { deep: true }
)

/**load giá trị đã được lưu vào indexedDB, khi trang được load */
export const getIndexedDB = (
    key: string,
    default_value: any,
    proceed: Cb
) => $indexed_db.get(key, (e, r) => proceed(e, r || default_value))