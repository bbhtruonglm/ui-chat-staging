/**thiết lập của môi trường này */
const ENV: IEnv = {
  local_storage: {
    prefix: 'chatbox_',
  },
  session_storage: {
    prefix: 'chatbox_',
  },
  host: {
    n3_socket: 'wss://retion-socket.drinkocany.com',
    n4_service_v2: 'https://retion-api.drinkocany.com/v1/n4_service',
    n5_app_v2: 'https://retion-api.drinkocany.com/v1/n5_app',
    n6_static: 'https://retion-api.drinkocany.com/v1/n6_static',
    n9_analytic_v2: 'https://retion-api.drinkocany.com/v1/n9_analytic_v2',
    billing: 'https://retion-api.drinkocany.com/v1/billing',
    ai: 'https://retion-api.drinkocany.com/v1/ai',
    chatbot: 'http://retion-chatbot-api.drinkocany.com/chatbot/v2/n3_service',

    n4_service_v1: '',
    n5_app_v1: 'https://wcss4s40o4g4c4wgc44w0gsw.35.198.216.143.sslip.io',
    n8_merge: '',
    widget: 'https://cwo4kg8s8okss448sgo4o4c8.35.198.216.143.sslip.io',
    n8_merge_v2: '',
    media_cdn: 'https://retion-api.drinkocany.com/v1/n6_static/cdn',
    n13_zalo_personal: 'https://retion-api.drinkocany.com/v1/n13_zalo_personal',
    n13_zalo_personal_socket: 'wss://retion-api.drinkocany.com/zalo-personal-qr',
    agent_config: 'https://retion-setting.drinkocany.com/embed/virtual-assistant',
    merchant: {
      contact: ''
    }
  },
  external_link: {
    setting: 'https://retion-setting.drinkocany.com',
    analytic: 'https://bbh-chart-nu.vercel.app',
    chatbot: 'https://retion-chatbot.drinkocany.com/#',
    chatbox: '',
    download: '',
    merchant: '',
    admin: '',
  },
  facebook: {
    app_id: '1282108599314861',
    // app_id: '303503746720418',
    permissions: [
      'public_profile',
      'pages_show_list',
      'pages_read_engagement',
      'pages_messaging',
      'email',
      'pages_read_user_content',
      // 'instagram_basic',
      'instagram_manage_comments',
      'instagram_manage_insights',
      'business_management',
      'ads_management',
      'read_insights',
      'pages_manage_metadata',
      'pages_manage_ads',
      'pages_manage_posts',
      'pages_manage_engagement',
      'page_events',
    ],
    login_option: {
      return_scopes: true,
      auth_type: 'rerequest',
      enable_profile_selector: true,
    },
    v2: {
      app_id: '1282108599314861',
      instagram: {
        redirect_uri:
          'https://chat.sellingpage.net/dashboard/select-platform?current_selected_tab=FB_INSTAGRAM',
        scoped: [
          'public_profile',
          'email',
          'pages_manage_metadata',
          'pages_read_engagement',
          'pages_show_list',
          'pages_read_user_content',
          'pages_manage_posts',
          'pages_manage_engagement',
          'pages_messaging',
          'ads_read',
          'ads_management',
          'page_events',
          // 'instagram_basic',
          'instagram_manage_messages',
          'instagram_manage_comments',
          'pages_manage_ads',
          'catalog_management',
          'leads_retrieval',
          'business_management',
          'read_page_mailboxes',
        ],
      },
    },
  },
  zalo_oa: {
    portal: 'https://chatbox-service-v3.botbanhang.vn/public/callback',
  },
  instagram: {
    redirect_uri: 'https://chat-dev.botbanhang.vn/instagram-redirect-uri',
    app_id: '1112081206912962',
    scope: [
      'instagram_business_basic',
      'instagram_business_manage_messages',
      'instagram_business_manage_comments',
      'instagram_business_content_publish,instagram_business_manage_insights',
    ],
  },
  platform: [
    'FB_MESS',
    'WEBSITE',
    'FB_WHATSAPP',
    'FB_INSTAGRAM',
    'ZALO',
    // 'ZALO_OA',
    // 'ZALO_PERSONAL',
  ],
  img_host: 'https://dev-api.botbanhang.vn/v1/n6_static/app/facebook/avatar',
  ai: {
    widget: {
      place_order: '66a4b5137dbeac01006e06ad',
      create_transaction: '66a4b5137dbeac01006e06ad',
      schedule_appointment: '66a4b51c7dbeac01006e06b2',
    },
  },
}

export default ENV
