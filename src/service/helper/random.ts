/**nguồn chữ */
const SOURCE_WORD = [
    'Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'Sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'Ut', 'enim', 'ad', 'minim', 'veniam,', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'cillum', 'dolore', 'Excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
]

/**random chữ */
export const random_word = () => {
    const INDEX = Math.floor(Math.random() * SOURCE_WORD.length)

    return SOURCE_WORD[INDEX]
}

/**random một câu */
export const random_sentence = ((start = 10, end = 50) => {
    /**độ dài từ từ 1 - 10 */
    const LENGTH = Math.floor(Math.random() * end) + start

    /**kết quả */
    const RESULT = []

    // nạp dữ liệu vào kết quả
    for (var i = 0; i < LENGTH; i++) RESULT.push(random_word())

    return RESULT.join(' ')
}) as (start?: number, end?: number) => string