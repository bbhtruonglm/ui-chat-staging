import { chatboxSync } from '@/service/api/chatbox/common'

import type {
  GenAnswerInput,
  TextTranslateInput,
  TextOutput,
} from '@/service/interface/app/ai'

/**dịch */
export const text_translate = async (
  body: TextTranslateInput
): Promise<TextOutput> =>
  chatboxSync({ uri: `${$env.host.ai}/app/prompt/text_translate`, body })

/**tạo câu trả lời */
export const gen_answer = async (body: GenAnswerInput): Promise<TextOutput> =>
  chatboxSync({ uri: `${$env.host.ai}/app/prompt/gen_answer`, body })
