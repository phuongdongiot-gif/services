# 🏢 Hệ Thống Microservices Bất Động Sản (BĐS)

Dự án này là nền tảng Backend Microservices quy mô lớn dành riêng cho **Giải Pháp Quản Lý và Kinh Doanh Bất Động Sản**. Hệ thống được tổ chức chuyên nghiệp dưới dạng Monorepo bằng **[Nx Workspace](https://nx.dev/)**, xây dựng dựa trên framework phần mềm lõi **[NestJS](https://nestjs.com/)** và giao tiếp tập trung thông qua kiến trúc **GraphQL Federation**.

---

## 🏗 Kiến Trúc Hệ Thống (System Architecture)

Dự án tự động scale và cô lập hoàn toàn các nghiệp vụ (domain-driven), bao gồm **1 API Gateway**, **10 Microservices** xử lý tác vụ độc lập, và **1 Shared Library**.

### 🌐 1. API Gateway (Apollo Federation Router)
- `apps/api-gateway`: Hoạt động dưới dạng cổng giao tiếp công cộng duy nhất (Public Facing) ở Port `3000`. Thay vì Client phải gọi lẻ tẻ 10 service khác nhau, API Gateway có nhiệm vụ tổ hợp tất cả GraphQL Subgraphs từ các microservice con thành một **Unified Supergraph** thống nhất.

### 📦 2. Các Microservices Cốt Lõi (Core Services)
Các service này kết nối trực tiếp với DB riêng hoặc DB chung để xử lý logic:
- 🔐 **Auth Service** (`apps/auth-service`): Xác thực người dùng (Login, JWT Tokens, Role-Based Access Control).
- 👤 **User Service** (`apps/user-service`): Quản lý hồ sơ định danh (Khách hàng người mua, Nhân viên Sales, Admin).
- 🏢 **Project Service** (`apps/project-service`): Lõi định danh cấu trúc Bất Động Sản (Tạo lập Dự án đa khu, Block tòa nhà, Tầng, Loại Căn hộ).
- 📦 **Inventory Service** (`apps/inventory-service`): Định vị kho hàng (Quản lý tình trạng số lượng theo: Trống, Đang giữ chỗ, Đã cọc, Sold-out).
- 🛒 **Booking Service** (`apps/booking-service`): Trái tim giao dịch (Logic Giữ chỗ giữ căn, Hợp đồng thỏa thuận đặt cọc).
- 💳 **Payment Service** (`apps/payment-service`): Quản lý vòng đời dòng tiền (Tính bảng hàng, Lịch thanh toán, Hook qua dịch vụ VNPay/Momo).
- 📬 **Notification Service** (`apps/notification-service`): Hệ thống gửi tin Alert (Bắn SMS, Zalo ZNS, Email tự động khi User thực hiện giao dịch).
- 📈 **CRM Service** (`apps/crm-service`): Chăm sóc tệp khách hàng, Funnel Conversion của Sales (Quản lý Leads tự động).
- 🖼️ **Media Service** (`apps/media-service`): Cổng lưu trữ tài nguyên phi cấu trúc (Upload/Serve Video, Brochure Image, Trải nghiệm không gian 360 độ).
- 🔍 **Search Service** (`apps/search-service`): Tích hợp trực tiếp bộ máy **ElasticSearch** nhằm cho phép Filter Căn hộ tốc độ siêu cao theo nhiều tiêu chí giá/hướng ban công...

### ⚙️ 3. Thư Viện Dùng Chung (Shared Library)
- 📚 `libs/shared-core`: Trạm chung chuyển mã (Shared Logic) bao gồm: DTOs, Object Interfaces, Utilities helper functions, System Custom Errors. Cung cấp mã nguồn dùng lại mà không vi phạm ranh giới service.

---

## 🛠 Bảng Công Nghệ (Tech Stack)

- **Ngôn ngữ**: TypeScript 
- **Quản lý Source Code**: Nx Monorepo (Tăng tốc độ Cache hóa, Local dependencies)
- **Framework API**: NestJS
- **Giao thức Phục Vụ**: GraphQL (Apollo Server & Federation) + REST
- **Môi trường Server (Containerization)**: Docker & Docker Compose
- **Database / Hạ Tầng Kèm Theo (Infrastructure)**:
  - 🐘 PostgreSQL 15 (Chính để lưu Data có tính quan hệ ACID)
  - 🔄 Redis 7 (Caching nóng, Async Jobs Pub/Sub)
  - 🔎 ElasticSearch 8.11 (Full-Text query Index)

---

## 🚀 Hướng Dẫn Kích Hoạt (Getting Started)

### Bước 1: Khởi Tạo Dependency
Tại thư mục root của dự án (nơi chứa nx.json), cài đặt toàn bộ core pack thông qua npm:
```bash
npm install
```

### Bước 2: Build Toàn Bộ Hệ Thống Lên Docker (Được Khuyên Dùng)
Để chạy mô hình full local với Database, chúng ta đã setup sẵn file `docker-compose.yml`. Mở cửa sổ Terminal:

**Lệnh 1:** Build (Biên dịch) toàn bộ TypeScript của cả 10 app ra code chạy file tĩnh:
```bash
npx nx run-many --target=build --all
```

**Lệnh 2:** Nâng toàn bộ Hệ Thống lên môi trường máy ảo Docker:
```bash
docker-compose up -d --build
```
Vào trình duyệt và kiểm tra cổng Gateway: `http://localhost:3000` (Playground GraphQL cho phép query tổng hợp sẽ online). Đọc thêm tại tài liệu chi tiết `docs/deployment.md`.

---

## 💻 Phương Thức Phát Triển & Code Mới

1. **Khởi chạy Development 1 Service Đơn Lẻ Mới (để dễ debug):**
```bash
npx nx serve project-service
```
*(Thay thế "project-service" bằng app đang phụ trách)*

2. **Dọn dẹp NX Caching:**
Đôi khi NX Cache bị conflict, hãy Clear cache thông minh của Nx bằng nút lệnh:
```bash
npx nx reset
```

---

## 📝 Lộ Trình Phát Triển (Roadmap Next Task)
- [ ] Connect các module với DB cụ thể (**PostgreSQL**) thông qua **TypeORM / Prisma**.
- [ ] Khởi tạo GraphQL Schema (Code-first approach `ObjectType` và `InputType`) cho các đối tượng **User**, **Project**, **Property**.
- [ ] Dựng Graph Endpoint `@ResolveReference` thực thi kiến trúc Subgraph.
- [ ] Cấu trúc Module Message Queue (RabbitMQ / Kafka) cho nghiệp vụ Transaction Booking.

*© Source Framework được quy hoạch và thiết lập độc quyền bởi Hệ Thực thể AI DeepMind cho Giải Pháp BĐS.*
