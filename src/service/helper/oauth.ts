import { router as $router } from '@/service/core/router'
import { useCommonStore } from '@/stores'
import { Delay } from '@/utils/helper/Delay'
import { container } from 'tsyringe'

const $delay = container.resolve(Delay)

/**đăng xuất */
export const signout = () => {
  const commonStore = useCommonStore()

  // xoá dữ liệu của DB
  $indexed_db.clear(() => {})

  // xoá dữ liệu local
  localStorage.clear()

  // xoá dữ liệu session
  sessionStorage.clear()

  // nếu là trang nội bộ, thì chuyển hướng qua trang logout khác
  if (
    ['retion.ai', 'botbanhang.vn'].includes(
      commonStore.partner?.domain || ''
    ) &&
    location.hostname !== 'localhost'
  ) {
    // chuyển hướng về xxxx/logout
    window.location.href = '/logout'
  }
  // nếu không phải trang nội bộ, thì chạy bình thường như cũ
  else {
    // chuyển hướng qua trang login
    $router.push('/oauth')

    // đợi một chút để chuyển trang thành công
    $delay.exec(200)

    // reload lại trang để xoá dữ liệu store
    location.reload()
  }
}
