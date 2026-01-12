# Mô Tả Luồng Ứng Dụng (App Flow) - Retion UI Chat

Tài liệu mô tả chi tiết toàn bộ luồng nghiệp vụ và cấu trúc chức năng của ứng dụng Retion UI Chat.

## 1. Overview (Tổng Quan)

Hệ thống hoạt động theo mô hình **Omnichannel Chatbot & CRM**, quản lý tập trung tin nhắn từ nhiều nền tảng (Facebook, Zalo, Website...).

- **Mô hình Dữ liệu**: `Organization` (Tổ chức) -> `Group` (Nhóm Page) -> `Page` (Trang).
- **Luồng hoạt động chính**: Authentication -> Context Selection (Select Page) -> Workspace (Chat) / Management (Dashboard).

---

## 2. Authentication (Module Xác Thực)

**Route**: `/oauth`

- **Login Flow**:
  - **Facebook Login**: Sử dụng `iframe/popup` để bypass domain restriction. Nhận Access Token từ Facebook để định danh user.
  - **Email Login**: Đăng nhập bằng tài khoản nội bộ (Email + Password).
- **Register Flow**: Xác thực số điện thoại/Email -> Bổ sung Profile.
- **Recovery**: Reset mật khẩu qua Email.

---

## 3. Dashboard - Select Page (Chọn Ngữ Cảnh)

**Route**: `/dashboard/select-page`

Đây là trung tâm điều hướng sau khi đăng nhập.

- **Context Switcher**:
  - Chọn `Organization`: Chuyển đổi giữa các công ty/tổ chức khác nhau.
  - Lọc `Group`: Lọc danh sách page theo nhóm nghiệp vụ (VD: Sale, CSKH).
- **Access Modes**:
  - **Single Access**: Chọn 1 Page -> Vào Chat của riêng Page đó.
  - **Unified Access (Merge Mode)**: Chọn nhiều Page -> Nhấn "Truy cập" -> Vào Chat Gộp (Unified Inbox), quản lý tin nhắn từ nhiều nguồn trên một giao diện.
- **Actions**:
  - Truy cập Cài đặt Tổ chức (`/dashboard/org`).
  - Thêm kết nối mới (`/dashboard/select-platform`).

---

## 4. Dashboard - Organization (Quản Trị Tổ Chức)

**Route**: `/dashboard/org`

Module quản lý tài nguyên và cấu hình sâu cho doanh nghiệp.

### 4.1. General Settings (`/setting`)

- **Thông tin chung**: Tên tổ chức, Logo.
- **Staff (`Setting/Staff.vue`)**: Mời nhân viên, phân quyền (Admin, Editor, Viewer), chia Page quản lý.
- **Department/Group (`Setting/Group.vue`)**: Tạo nhóm page để dễ quản lý.
- **Conversation Rules (`Setting/Conversation.vue`)**: Cấu hình quy tắc chia hội thoại tự động (Round Robin, Last Interaction...).
- **Customer Fields (`Setting/CustomerInfo.vue`)**: Cấu hình các trường thông tin tùy chỉnh (Custom Fields) cho CRM.
- **AI Agent (`Agent.vue`)**: Cấu hình trợ lý ảo tự động trả lời.

### 4.2. Billing & Finance (`/pay`)

- **Pack Info (`PackInfo.vue`)**:
  - Theo dõi hạn sử dụng gói cước.
  - **Quota Monitor**: Thanh tiến trình hiển thị dung lượng đã dùng (Số user, Số page, Số tin nhắn giới hạn).
- **Recharge (`ReCharge.vue`)**:
  - Nạp tiền vào ví (Chuyển khoản QR Code, Payment Gateway).
  - Lịch sử giao dịch (`History.vue`).
  - Xuất hóa đơn điện tử.

### 4.3. Integration

- **Apps (`App.vue`)**: Quản lý danh sách các App đã kết nối (FB App, Zalo OA...).
- **Webhook (`Webhook.vue`)**: Cấu hình endpoint nhận dữ liệu realtime (Message, Comment, Order) sang hệ thống thứ 3 (ERP/CRM riêng).
- **API Key (`Api.vue`)**: Quản lý Key cho Developer.

---

## 5. Connect Platform (Kết Nối Kênh)

**Route**: `/dashboard/select-platform`

Quy trình kết nối đa kênh vào hệ thống:

1.  **Facebook / Instagram**:
    - OAuth Popup xin quyền `manage_pages`, `read_page_mailboxes`.
    - Đồng bộ danh sách Fanpage & Instagram Business.
2.  **Zalo Official Account (OA)**:
    - Redirect sang Zalo Portal -> User cấp quyền -> Callback về hệ thống.
3.  **Zalo Personal (Cá nhân)**:
    - Hệ thống sinh mã QR (qua Socket) -> User dùng App Zalo quét -> Đồng bộ session.
4.  **Website**:
    - Khai báo tên miền -> Hệ thống sinh mã nhúng (Embed Script).
    - Hỗ trợ Chat Bubble và Guest Chat.

---

## 6. Chat Workspace (Không Gian Làm Việc)

**Route**: `/chat`
**Kiến trúc**: 3-Pane Layout (Trái - Giữa - Phải).

### 6.1. Left Bar (Quản Lý Hội Thoại)

**Dir**: `views/ChatWarper/Chat/LeftBar`

- **Header (`Header.vue`)**:
  - **Filter Tabs**: Tất cả, Chưa đọc, Có SĐT, Chưa trả lời.
  - **Advanced Filter**: Lọc theo Tag, theo Nhân viên phụ trách, theo Khoảng thời gian.
- **One List (`Conversation.vue`)**:
  - Danh sách hội thoại Realtime (Socket update, tự động đẩy lên top).
  - **Indicators**: Logo kênh (FB/Zalo), Trạng thái online, Last message.
  - **Lazy Load**: Cuộn vô tận để xem lịch sử.

### 6.2. Center Content (Khu Vực Tương Tác)

**Dir**: `views/ChatWarper/Chat/CenterContent`

- **Message List (`MessageList.vue`)**:
  - **Supported Types**: Text, Image, Video, File, Audio, Location.
  - **Special Types**: Facebook Post, Ad Message (có kèm Ad ID), Order Card (Thông tin đơn hàng).
  - **Status**: Đang gửi, Đã gửi, Đã nhận, Đã xem (Read receipt).
- **Input Composer (`InputChat`)**:
  - **Features**: Gửi ảnh (Drag & Drop), Gửi Voice, Emoji Picker.
  - **Extensions**: Chèn mẫu câu nhanh (Quick Reply), Chèn thông tin sản phẩm.
  - **Reply**: Trả lời cụ thể (Reply quote), Phản hồi bình luận (Reply Comment).

### 6.3. Right Bar (Widget Container)

**Dir**: `views/ChatWarper/Chat/RightBar`
**Kiến trúc**: Micro-frontend (Widget based).
Thanh bên phải hoạt động như một "Container" chứa các ứng dụng con (Widgets) chạy dưới dạng `iframe` độc lập:

- **Customer Profile (CRM)**: Xem/Sửa thông tin khách, Note, Tags (Là 1 widget mặc định).
- **Order Management**: Tạo đơn, tra cứu vận chuyển, lịch sử mua hàng.
- **AI Journey (`AiJourney.vue`)**: Tóm tắt hành trình khách hàng bằng AI.
- **Post Analytic (`PostRightBar.vue`)**: Nếu đang chat trên 1 bài Post, hiển thị thống kê like/comment của bài đó.
- **Marketplace Apps**: Các ứng dụng bên thứ 3 (Vòng quay, Minigame...) cài từ chợ ứng dụng.

---

## 7. Technical Highlights

- **Realtime**: WebSocket (`Socket.io`) xử lý sự kiện tin nhắn mới, typing, update status tức thì.
- **State Management**: `Pinia` (Stores: Page, Org, Converstation, Message) giúp đồng bộ dữ liệu giữa các component phức tạp.
- **Isolation**: Hệ thống Widget ở Right Bar chạy trong `iframe` giúp phân tách code, đảm bảo an toàn và dễ dàng mở rộng (kết nối bên thứ 3).
