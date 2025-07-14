import { singleton } from 'tsyringe'

import type { MessageInfo } from '@/service/interface/app/message'

/**ánh xạ các cảm xúc */
const MAP_ICON: Record<string, string> = {
  like: '👍',
  happiness: '😊',
  happy: '😊',
  anger: '😡',
  angry: '😡',
  sadness: '😢',
  sad: '😢',
  fear: '😱',
  surprise: '😲',
  disgust: '🤢',
  love: '❤️',
  jealousy: '😒',
  shame: '😳',
  pride: '😌',
}
/**các cảm xúc tích cực */
const POSITIVE_EMOTION = [
  'like',
  'happiness',
  'happy',
  'love',
  'pride',
  'surprise',
]
/**cảm xúc cần nêu bật */
const HIGHT_LIGHT_EMOTION = ['happiness', 'happy', 'anger', 'angry', 'like']
/**cảm xúc cần nêu bật trong tin nhắn trang */
const HIGHT_LIGHT_EMOTION_MESS_PAGE = ['anger', 'angry']
/**cảm xúc cần nêu bật trong tin nhắn của khách */
const HIGHT_LIGHT_EMOTION_MESS_CLIENT = ['happiness', 'happy', 'anger', 'angry']

/**Lớp hỗ trợ xử lý cảm xúc */
export interface IEmotion {
  /**cảm xúc có phải là tích cực không */
  isPositive(input: string): boolean
  /**cảm xúc có hợp lệ không */
  isValidEmotion(input: string): boolean
  /**lấy icon của cảm xúc */
  getIcon(input?: string): string
  /**cảm xúc này có cần nêu bật không */
  isHighlight(input: string): boolean
  /**cảm xúc này có cần nêu bật trong tin nhắn không */
  isHighlightInMess(input: string, type?: MessageInfo['message_type']): boolean
}

/**Lớp hỗ trợ xử lý cảm xúc */
@singleton()
export class Emotion implements IEmotion {
  /**cảm xúc có phải là tích cực không */
  isPositive(input: string): boolean {
    // kiểm tra trong danh sách cảm xúc tích cực
    return POSITIVE_EMOTION.includes(input)
  }
  /**cảm xúc có hợp lệ không */
  isValidEmotion(input?: string): boolean {
    // nếu không có input thì trả về false
    if (!input) return false

    // nếu không có trong danh sách cảm xúc thì trả về false
    if (!MAP_ICON?.[input]) return false

    // trả về true
    return true
  }
  /**lấy icon của cảm xúc */
  getIcon(input?: string): string {
    // nếu không có input thì trả về chuỗi rỗng
    if (!input) return ''

    // trả về icon của cảm xúc
    return MAP_ICON?.[input] || ''
  }
  /**cảm xúc này có cần nêu bật không */
  isHighlight(input: string): boolean {
    // kiểm tra trong danh sách cảm xúc
    return HIGHT_LIGHT_EMOTION.includes(input)
  }
  /**cảm xúc này có cần nêu bật trong tin nhắn không */
  isHighlightInMess(
    input: string,
    type?: MessageInfo['message_type']
  ): boolean {
    // xử lý theo loại tin nhắn
    switch (type) {
      // tin của trang
      case 'page':
        return HIGHT_LIGHT_EMOTION_MESS_PAGE.includes(input)
      // tin của khách
      case 'client':
        return HIGHT_LIGHT_EMOTION_MESS_CLIENT.includes(input)
      // ẩn hết các tin khác
      default:
        return false
    }
  }
}
