/**
 * custom lại sweetalert
 */

import Swal from 'sweetalert2'

import type { SweetAlertIcon, SweetAlertPosition } from 'sweetalert2'
import type { Cb } from '@/service/interface/function'

/**thông báo dạng toast */
export const toast = (
  icon: SweetAlertIcon,
  title: string,
  position: SweetAlertPosition = 'top-end',
  timer: number = 3000 // #note default 3000 s
) =>
  Swal.fire({
    icon,
    title,
    position,
    timer,
    toast: true,
    showConfirmButton: false,
    timerProgressBar: true,
    customClass: {
      popup: 'mt-[60px] md:mt-[20px] xl:mt-0',
    },
    didOpen: (r: HTMLElement) => {
      r.addEventListener('mouseenter', Swal.stopTimer)
      r.addEventListener('mouseleave', Swal.resumeTimer)
    },
  })

/**thông báo dạng confirm */
export const confirm = (
  icon: SweetAlertIcon,
  title: string,
  text: string,
  proceed: Cb,
  confirm_text?: string,
  cancel_text?: string
) =>
  Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    ...(confirm_text && { confirmButtonText: confirm_text }),
    ...(cancel_text && { cancelButtonText: cancel_text })
  }).then(({ isConfirmed }: { isConfirmed: boolean }) => {
    if (!isConfirmed) return proceed(true)

    proceed()
  })
/**thông báo dạng confirm */
export const confirmSync = async (
  icon: SweetAlertIcon,
  title: string,
  text?: string
) =>
  Swal.fire({ title, text, icon, showCancelButton: true }).then(
    ({ isConfirmed }: { isConfirmed: boolean }) => isConfirmed
  )

/**thông báo lỗi dạng toast */
export const toastError = (e: any) => {
  let title = e.message || e

  // tự động parser obj thành string
  if (typeof title === 'object') title = JSON.stringify(title, null, 4)

  toast('error', title)
}

/**tạo một modal dạng input */
export const modal_input = (title: string, description: string, proceed: Cb) =>
  Swal.fire({
    title,
    input: 'text',
    inputLabel: description,
    showCancelButton: true,
  }).then(({ value }) => {
    if (!value) return proceed(true)

    proceed(null, value)
  })
