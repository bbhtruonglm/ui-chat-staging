import { getItem } from '@/service/helper/localStorage'

import type { Router } from 'vue-router'

/**check token trong local */
const isExitAccessToken = () => !!getItem('access_token')

/**kiểm tra đã có token trong local | đã đăng nhập hay chưa */
const checkAccessToken = (router: Router) => router.beforeEach((
    to,
    from,
    proceed
) => {
    // nếu vào dashboard mà chưa đăng nhập thì redirecr qua login
    if (
        !isExitAccessToken() &&
        to.path.indexOf('/dashboard') === 0
    ) return proceed('/oauth')

    proceed()
})

export const loadMiddleware = (router: Router) => {
    checkAccessToken(router)
}