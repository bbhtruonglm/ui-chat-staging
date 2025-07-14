import type { Cb } from '@/service/interface/function'

/**
 * export các biến môi trường dựa theo node_env hiện tại 
 * @deprecated dùng hàm EnvManage thay thế
 */
export function currentEnv(proceed: (e: any, r: {
    $env: IEnv
    $node_env: string
}) => void) {
    // lấy current env
    const NODE_ENV = import.meta.env.VITE_APP_ENV || 'development'
    
    // load file config theo env
    // ?: không hiểu sau đổi sang path config thì không dùng được @ mà phải dùng ../
    import(`../../configs/envs/${NODE_ENV}.ts`).then(r => {
        const ENV: { default: IEnv } = r

        proceed(null, { $env: ENV.default, $node_env: NODE_ENV })
    })
}

/**@deprecated */
export function loadEnv(proceed: Cb) {
    currentEnv((e, r) => {
        globalThis.$env = r.$env
        globalThis.$node_env = r.$node_env

        proceed()
    })
}