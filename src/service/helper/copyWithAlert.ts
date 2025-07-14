import { toast } from './alert'
import { i18n } from '@/lang'

/**
 * Custom copy to clipboard
 * @deprecated use Clipboard instead
 */
export const copyToClipboard = (
    text: string,
    alert?: string
): void => {
    const $t = i18n.global.t

    navigator.clipboard.writeText(text)

    toast(
        'success',
        alert || $t('v1.common.copy_to_clipboard')
    )
}