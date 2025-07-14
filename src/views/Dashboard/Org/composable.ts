import { useOrgStore } from '@/stores'
import { update_org } from '@/service/api/chatbox/billing'
import { toast, toastError } from '@/service/helper/alert'
import { useI18n } from 'vue-i18n'

export function initRequireData() {
  const orgStore = useOrgStore()
  const { t: $t } = useI18n()

  /**update thông tin org lên server */
  async function updateOrg() {
    // nếu chưa chọn org thì thôi
    if (!orgStore.selected_org_id) return
  
    // bật loading
    orgStore.is_loading = true
  
    try {
      // gọi api update
      await update_org(orgStore.selected_org_id, {
        org_config: orgStore.selected_org_info?.org_config,
      })
  
      // thông báo thành công
      toast('success', $t('v1.common.update_success'))
    } catch (e) {
      // thông báo lỗi
      toastError(e)
    }
  
    // tắt loading
    orgStore.is_loading = false
  }

  return { updateOrg }
}
