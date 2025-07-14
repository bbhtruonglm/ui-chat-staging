<template>
  <div class="w-full h-full bg-slate-100 md:bg-white">
    <div class="bg-white pt-[65px] md:pt-8 xl:pt-4">
      <div class="pl-14 pr-4 md:pl-4">
        <Search
          class="md:w-[300px]"
          v-model="search"
          :placeholder="$t('v1.common.page_search_placeholder')"
        />
      </div>
      <PlatformTab
        v-model="current_selected_tab"
        :platform_list="list_tab_select"
      />
    </div>
    <div
      class="px-2 pt-2 relative h-[calc(100%_-_229px)] md:h-[calc(100%_-_169px)]"
    >
      <div
        class="flex items-center justify-between mb-2 md:absolute md:top-[-40px] md:right-[9px]"
      >
        <div class="text-slate-500 mr-1">
          {{ $t('v1.view.main.dashboard.select_platform.empty_page') }}
        </div>
        <template v-if="current_selected_tab === 'FB_MESS'">
          <Facebook
            @access_token="syncFacebookPage"
            class="w-[130px] h-[40px]"
            border_radius="5px"
            :text="$t('v1.view.main.dashboard.select_platform.add_page')"
            :option="genFBSelectPageOption()"
          />
          <Facebook
            @access_token="syncFacebookPage"
            class="w-[130px] h-[40px] ml-2"
            border_radius="5px"
            :text="$t('v1.view.main.dashboard.select_platform.grant_permision')"
          />
        </template>
        <template v-if="current_selected_tab === 'FB_INSTAGRAM'">
          <Instagram
            @access_token="
              access_token => syncFacebookPage(access_token, 'FB_INSTAGRAM')
            "
            :text="$t('v1.view.main.dashboard.select_platform.grant_permision')"
          />
        </template>
        <template v-if="current_selected_tab === 'ZALO_OA'">
          <ZaloOA
            @access_token="getAllPageOfUser()"
            :text="$t('v1.view.main.dashboard.select_platform.grant_permision')"
          />
        </template>
        <button
          @click="toggleCreateNewWebsiteModal"
          v-if="current_selected_tab === 'WEBSITE'"
          class="w-[130px] h-[40px] text-white bg-cyan-500 rounded hover:bg-cyan-600 flex items-center justify-center"
        >
          <img
            src="@/assets/icons/website.svg"
            width="20"
            height="20"
          />
          {{ $t('v1.view.main.dashboard.select_platform.add_page') }}
        </button>
        <Modal ref="create_new_website_ref">
          <template v-slot:header>
            {{
              $t('v1.view.main.dashboard.select_platform.create_website.title')
            }}
          </template>
          <template v-slot:body>
            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[calc(100vh_-_254px)] overflow-y-auto"
            >
              <InputLabel
                v-model="create_new_website_data.description"
                :title="
                  $t(
                    'v1.view.main.dashboard.select_platform.create_website.description'
                  )
                "
                :placeholder="
                  $t(
                    'v1.view.main.dashboard.select_platform.create_website.enter_description'
                  )
                "
              />
              <InputLabel
                v-model="create_new_website_data.name"
                :title="
                  $t(
                    'v1.view.main.dashboard.select_platform.create_website.link_website'
                  )
                "
                :placeholder="
                  $t(
                    'v1.view.main.dashboard.select_platform.create_website.enter_link_website'
                  )
                "
              />
              <InputLabel
                v-model="create_new_website_data.avatar"
                :title="
                  $t(
                    'v1.view.main.dashboard.select_platform.create_website.link_icon'
                  )
                "
                :placeholder="
                  $t(
                    'v1.view.main.dashboard.select_platform.create_website.enter_link_icon'
                  )
                "
                class="grid-"
              />
            </div>
          </template>
          <template v-slot:footer>
            <div>
              <button
                @click="createNewWebsite"
                class="w-[130px] h-[40px] text-white bg-cyan-500 rounded hover:bg-cyan-600 flex items-center justify-center mx-auto"
              >
                <img
                  src="@/assets/icons/website.svg"
                  width="20"
                  height="20"
                />
                {{ $t('v1.view.main.dashboard.select_platform.add_page') }}
              </button>
            </div>
          </template>
        </Modal>
        <button
          @click="embeddedSignUpWhatsapp"
          v-if="current_selected_tab === 'FB_WHATSAPP'"
          class="w-[130px] h-[40px] text-white bg-green-600 rounded hover:bg-green-700 flex items-center justify-center"
        >
          <img
            src="@/assets/icons/whatsapp.svg"
            width="30"
            height="30"
          />
          {{ $t('v1.view.main.dashboard.select_platform.add_page') }}
        </button>
      </div>
      <div
        v-if="is_loading_page_list"
        class="absolute left-[50%] translate-x-[-50%]"
      >
        <Loading class="mx-auto" />
      </div>
      <div
        v-if="!filter_page_list || !filter_page_list.length"
        class="h-[calc(100%_-_36px)] md:h-full flex justify-center pt-10"
      >
        <div>
          <img
            src="@/assets/icons/empty-page.svg"
            class="mx-auto w-[200px]"
          />
          <div class="text-center text-slate-500">
            {{ $t('v1.view.main.dashboard.select_platform.click_add_page') }}
          </div>
        </div>
      </div>
      <div
        :class="{
          'md:grid-cols-3 xl:grid-cols-4': commonStore.dashboard_toggle_nav,
        }"
        class="max-h-[calc(100%_-_36px)] overflow-y-auto grid grid-cols-1 pb-5 md:max-h-full md:grid-cols-2 gap-2 md:gap-4 xl:grid-cols-3"
      >
        <template v-for="page of filter_page_list">
          <PageItem
            v-if="page?.page"
            :page_info="page.page"
            @click="toggleSelectThisPage(page)"
          >
            <div class="flex justify-end">
              <input
                :disabled="page.page?.is_active"
                :checked="page.page?.is_active || page.is_select"
                type="checkbox"
                class="w-[15px] h-[15px] mr-2 accent-orange-600"
              />
            </div>
          </PageItem>
        </template>
      </div>
    </div>
    <FooterButton
      :text="$t('v1.view.main.dashboard.select_platform.active')"
      @click_btn="activePageSelect"
      :disabled="!countSelectPage()"
      :count="countSelectPage()"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCommonStore } from '@/stores'
import { flow } from '@/service/helper/async'
import {
  get_current_active_page,
  sync_facebook_page,
  create_website_page,
  update_page,
} from '@/service/api/chatbox/n4-service'
import { debounce, keyBy, map, mapValues, sortBy } from 'lodash'
import { nonAccentVn } from '@/service/helper/format'
import { useRoute } from 'vue-router'
import { toast } from '@/service/helper/alert'
import { eachOfLimit } from 'async'
import { copy } from '@/service/helper/format'

import Loading from '@/components/Loading.vue'
import Search from '@/components/Main/Dashboard/Search.vue'
import PlatformTab from '@/components/Main/Dashboard/PlatformTab.vue'
import PageItem from '@/components/Main/Dashboard/PageItem.vue'
import FooterButton from '@/components/Main/Dashboard/FooterButton.vue'
import Facebook from '@/components/OAuth/Facebook.vue'
import Instagram from '@/components/OAuth/Instagram.vue'
import ZaloOA from '@/components/OAuth/ZaloOA.vue'
import Modal from '@/components/Modal.vue'
import InputLabel from '@/components/Main/Dashboard/InputLabel.vue'

import type { CbError } from '@/service/interface/function'
import type {
  PageData,
  PageWebsiteCreate,
  PageList,
} from '@/service/interface/app/page'
import type { TabPlatform } from '@/service/interface/app/page'
import type { ComponentRef } from '@/service/interface/vue'

/**
 * những page được active rồi (is_active: true) sẽ bị disable khả năng chọn
 * các page còn lại sẽ dựa theo is_select để tính toán
 */
interface ThisPageData extends PageData {
  is_select?: boolean
}

const { t: $t } = useI18n()
const commonStore = useCommonStore()
const $route = useRoute()

/**danh sách các tab gốc */
const ROOT_TAB = {
  ...mapValues(keyBy($env.platform), n => {
    return {
      title: $t(`v1.common.${n.toLowerCase()}`),
      count: 0,
    }
  }),
}
/**danh sách các tab */
const list_tab_select = ref<TabPlatform>(copy(ROOT_TAB))

/**nền tảng hiện tại đang được chọn */
const current_selected_tab = ref<string>(
  ($route.query?.current_selected_tab as string) || 'FB_MESS'
)
/**danh sách page sau khi được lọc */
const filter_page_list = ref<ThisPageData[]>()
/**tìm kiếm danh sách page theo tên hoặc id */
const search = ref('')
/**gắn cờ loading cho danh sách page */
const is_loading_page_list = ref(false)
/**ref của modal tạo mới website */
const create_new_website_ref = ref<ComponentRef>()
/**data tạo mới website */
const create_new_website_data = ref<PageWebsiteCreate>({
  org_id: '',
  avatar: '',
  description: '',
  name: '',
})
/**danh sách toan bộ các page của user */
const page_list = ref<PageList>()

// lọc danh sách page khi được tìm kiếm
watch(
  () => search.value,
  () => {
    // kích hoạt loading
    is_loading_page_list.value = true

    delayFilterListPage()
  }
)
// lọc danh sách page khi chọn tab
watch(
  () => current_selected_tab.value,
  () => filterListPage()
)
// nạp lại danh sách page thì có thay đổi
watch(
  () => page_list.value,
  () => filterListPage()
)

onMounted(() => getAllPageOfUser())

/**sử dụng thiết lập này để hiển thị danh sách trang muốn cấp quyền */
function genFBSelectPageOption() {
  let login_option = {
    scope: [
      'public_profile',
      'manage_pages',
      'pages_show_list',
      'pages_messaging',
      'email',
      'read_page_mailboxes',
      'pages_read_user_content',
      'pages_read_engagement',
      'publish_pages',
      'read_insights',
      // 'instagram_basic',
      'instagram_manage_comments',
      'instagram_manage_insights',
      'pages_manage_metadata',
      'pages_manage_posts',
      'pages_manage_engagement',
      'ads_management',

      // 'page_events', // quyền này làm mất nút chọn page
      // 'pages_manage_ads', // quyền này làm mất nút chọn page
      // 'business_management', // nếu thêm quyền này thì fb không hiển thị popup chọn trang
    ].join(),
    enable_profile_selector: true,
    auth_type: 'rerequest',
  }
  return JSON.stringify(login_option)
}
/**đồng bộ dữ liệu page mới nhất từ fb */
function syncFacebookPage(access_token: string, from: string) {
  flow(
    [
      // * call api đồng bộ page từ fb
      (cb: CbError) =>
        sync_facebook_page(access_token, from, (e, r) => {
          if (e) return cb(e)

          cb()
        }),
      // * load lại danh sách page mới nhất
      (cb: CbError) => {
        getAllPageOfUser()

        cb()
      },
    ],
    undefined,
    true
  )
}
/**thay đổi giá trị lựa chọn page để chat */
function toggleSelectThisPage(page: ThisPageData) {
  if (!page.page?.fb_page_id || page.page?.is_active) return

  page.is_select = !page.is_select
}
/**delay khi tìm kiếm page */
const delayFilterListPage = debounce(() => filterListPage(), 300)
/**lọc danh sách page để hiển thị theo các điều kiện được lựa chọn */
function filterListPage() {
  // kích hoạt loading
  is_loading_page_list.value = true

  // object -> array
  let array_page_list = map(page_list.value)

  /**
   * lọc các page phù hợp điều kiện tìm kiếm
   * - tìm kiếm theo tên hoặc id
   * - lọc theo tab
   */
  array_page_list = array_page_list.filter(page_data => {
    // chuyển dữ liệu tìm kiếm về tiếng việt không dấu
    let formated_page_name = nonAccentVn(page_data.page?.name || '')
    let page_id = page_data.page?.fb_page_id || ''
    let formated_search_value = nonAccentVn(search.value)
    let page_type = page_data.page?.type

    if (
      // lọc theo tab
      current_selected_tab.value === page_type &&
      // tìm kiếm theo tên hoặc id
      (formated_page_name.includes(formated_search_value) ||
        page_id.includes(formated_search_value))
    )
      return true

    return false
  })

  // sắp xếp các page active lên đầu
  array_page_list = sortBy(array_page_list, 'page.is_active')

  // đảo chiều mảng
  array_page_list = array_page_list.reverse()

  filter_page_list.value = array_page_list

  // tắt loading
  is_loading_page_list.value = false
}
/**lấy toàn bộ các page của user này */
function getAllPageOfUser() {
  flow(
    [
      // * kích hoạt loading
      (cb: CbError) => {
        is_loading_page_list.value = true

        cb()
      },
      // * call api đọc danh sách page
      (cb: CbError) =>
        get_current_active_page({}, (e, r) => {
          if (e) return cb(e)

          page_list.value = r.page_list
          cb()
        }),
      // * tính count cho từng nền tảng
      (cb: CbError) => {
        cb()

        // reset count
        list_tab_select.value = copy(ROOT_TAB)
        mapValues(page_list.value, page_data => {
          const PAGE_TYPE = page_data.page?.type

          if (!PAGE_TYPE) return

          // count cho từng page type
          list_tab_select.value[PAGE_TYPE].count++
        })
      },
    ],
    e => {
      // tắt loading
      is_loading_page_list.value = false
    }
  )
}
/**mở modal tạo website */
function toggleCreateNewWebsiteModal() {
  // mở modal tạo website
  create_new_website_ref.value.toggleModal()
}
/**đồng bộ dữ liệu waba */
function embeddedSignUpWhatsapp() {
  toast('info', $t('v1.common.upcoming_feature'))
}
/**tạo mới page website */
function createNewWebsite() {
  flow(
    [
      // * tạo mới page website
      (cb: CbError) =>
        create_website_page(create_new_website_data.value, (e, r) => {
          if (e) return cb(e)

          cb()
        }),
      // * tắt modal, thông báo thành công và load lại danh sách trang
      (cb: CbError) => {
        toggleCreateNewWebsiteModal()

        getAllPageOfUser()

        toast(
          'success',
          $t('v1.view.main.dashboard.select_platform.create_website.success')
        )

        cb()
      },
    ],
    undefined,
    true
  )
}
/**đếm số page đã được chọn */
function countSelectPage() {
  return filter_page_list.value?.filter(n => n.is_select).length
}
/**kích hoạt các page được chọn */
function activePageSelect() {
  const DATA: {
    list_active_page: ThisPageData[]
  } = {
    list_active_page: [],
  }
  flow(
    [
      // * lọc ra các page được chọn
      (cb: CbError) => {
        DATA.list_active_page =
          filter_page_list.value?.filter(n => n.is_select) || []

        cb()
      },
      // * active các page được chọn
      (cb: CbError) => {
        eachOfLimit(
          DATA.list_active_page,
          1,
          (page: ThisPageData, i, next) =>
            update_page(
              {
                page_id: page.page?.fb_page_id,
                is_active: true,
              },
              (e, r) => {
                if (e) return next(e)

                next()
              }
            ),
          cb
        )
      },
      // * load lại danh sách page + thông báo thành công
      (cb: CbError) => {
        getAllPageOfUser()

        toast('success', $t('v1.view.main.dashboard.select_platform.success'))

        cb()
      },
    ],
    undefined,
    true
  )
}
</script>
