/**
 * lưu local với prefix
 * - tự động đổi thành string trước khi lưu
 */
export const setItem = (
    (
        key, value, prefix = $env.local_storage.prefix
    ) => localStorage.setItem(`${prefix}${key}`, JSON.stringify(value))
) as (key: string, value: any, prefix?: string) => void

/**
 * đọc local với prefix
 * - tự động parser object
 */
export const getItem = (
    (
        key, prefix = $env.local_storage.prefix
    ) => {
        try {
            return JSON.parse(localStorage.getItem(`${prefix}${key}`) as string)
        } catch (e) {
            
        }
    }
) as (key: string, prefix?: string) => any