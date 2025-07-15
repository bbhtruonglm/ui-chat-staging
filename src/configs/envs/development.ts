/**thiết lập của môi trường này */
const ENV: IEnv = {
  local_storage: {
    prefix: 'chatbox_',
  },
  session_storage: {
    prefix: 'chatbox_',
  },
  host: {
    n3_socket: 'wss://c4ccc0ss8occokkwcgows4k4.34.142.144.129.sslip.io',
    n4_service_v2: 'https://kkoo8oggckc880wook00c0w0.34.142.144.129.sslip.io/v1/n4_service',
    n5_app_v2: 'https://kkoo8oggckc880wook00c0w0.34.142.144.129.sslip.io/v1/n5_app',
    n6_static: 'https://kkoo8oggckc880wook00c0w0.34.142.144.129.sslip.io/v1/n6_static',
    n9_analytic_v2: 'https://kkoo8oggckc880wook00c0w0.34.142.144.129.sslip.io/v1/n9_analytic_v2',
    billing: 'https://kkoo8oggckc880wook00c0w0.34.142.144.129.sslip.io/v1/billing',
    ai: 'https://kkoo8oggckc880wook00c0w0.34.142.144.129.sslip.io/v1/ai',
    chatbot: 'http://gg4w48o0csk4ww4k800kwgkc.34.142.144.129.sslip.io/chatbot/v2/n3_service',

    n4_service_v1: 'https://dev-api.botbanhang.vn/service',
    n5_app_v1: '',
    n8_merge: '',
    widget: '',
    n8_merge_v2: 'https://dev-api.botbanhang.vn/v1/n8_merge',
    media_cdn: 'https://kkoo8oggckc880wook00c0w0.34.142.144.129.sslip.io/v1/n6_static/cdn',
    n13_zalo_personal: 'https://kkoo8oggckc880wook00c0w0.34.142.144.129.sslip.io/v1/n13_zalo_personal',
    n13_zalo_personal_socket: 'wss://kkoo8oggckc880wook00c0w0.34.142.144.129.sslip.io/zalo-personal-qr',
    agent_config: 'https://bbh-setting-dev.vercel.app/embed/virtual-assistant',
    merchant: {
      contact: 'https://api-contact.merchant.vn'
    }
  },
  external_link: {
    setting: 'http://localhost:5173',
    analytic: 'https://bbh-chart-nu.vercel.app',
    chatbot: 'https://localhost:8001/#',
    chatbox: 'https://chat-dev.botbanhang.vn',
    download: 'https://sellingpage.net/download',
    merchant: 'https://merchant.vn',
    admin: 'https://dashboard-dev-ten.vercel.app',
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
