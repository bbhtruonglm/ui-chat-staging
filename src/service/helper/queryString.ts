/**
 * đọc param | query string trên url
 */
export const queryString = (
    key: string,
    url: string = window.location.href
) => {
    key = key.replace(/[\[\]]/g, '\\$&')

    var regex: RegExp = new RegExp('[?&]' + key + '(=([^&#]*)|&|#|$)')

    var results: RegExpExecArray | null = regex.exec(url)

    if (!results || !results[2]) return

    return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

/**đọc ra tên file từ url */
export const getFileName = (url?: string) => {
    if (!url) return ''

    return new URL(url)
        ?.pathname
        ?.split('/')
        ?.pop()
        ?.split('?')
        ?.[0]
}