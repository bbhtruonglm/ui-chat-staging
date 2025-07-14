import { v_tooltip } from '@/service/directive/tooltip'

import type { App } from 'vue'
import type { Cb } from '@/service/interface/function'

/**load các directive cho vue */
export const loadDirective = (APP: App, proceed: Cb) => {
    v_tooltip(APP)

    proceed()
}