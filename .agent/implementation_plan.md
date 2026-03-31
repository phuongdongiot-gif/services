# Base Architecture for Real Estate Backend (Nx + NestJS + GraphQL)

Xây dựng hệ thống backend microservices cho giải pháp bất động sản sử dụng Nx monorepo, NestJS và GraphQL.

## User Review Required

> [!IMPORTANT]
> - Đây là một hệ thống lớn bao gồm 10 microservices và API Gateway. Quá trình triển khai sẽ bao gồm nhiều bước tạo project, cấu hình.
> - **Kiến trúc GraphQL**: Để 10 dịch vụ GraphQL có thể hoạt động trơn tru như một thể thống nhất, tôi sẽ cấu hình theo mô hình **GraphQL Federation (Apollo Gateway)**.
> - Vui lòng xem xét các Phase dưới đây và xác nhận (Approve) để tôi bắt đầu chạy tự động Phase 1. Hành động này sẽ tạo ra hàng loạt project trong thư mục hiện tại.

## Proposed Changes

Tôi đã chia yêu cầu của bạn thành 6 Phase nhỏ để tự động chạy và dễ dàng kiểm soát chất lượng:

### Phase 1: Môi trường & Core Nx Workspace
- Khởi tạo Nx workspace (monorepo) tại thư mục hiện hành.
- Cài đặt `@nx/nest` và tổ hợp các package liên quan đến GraphQL (`@nestjs/graphql`, `@nestjs/apollo`, `@apollo/server`, `graphql`).
- Sinh ra shared library `shared-core` để chứa các interface, utility functions dùng chung cho tất cả các service.

### Phase 2: Core Services (Identity & Access)
Tạo NestJS apps và khởi tạo module GraphQL căn bản:
- `auth-service`: Quản lý Đăng nhập, JWT, RBAC.
- `user-service`: Quản lý khách hàng, sale, admin.

### Phase 3: BĐS Core Services (Sản phẩm & Tồn kho)
Tạo NestJS apps:
- `project-service`: Cấu trúc dự án, block, tầng, căn hộ.
- `inventory-service`: Thông tin tồn kho căn hộ theo trạng thái.
- `media-service`: Upload ảnh/video/360.

### Phase 4: Transaction Services (Giao dịch)
Tạo NestJS apps:
- `booking-service`: Chức năng giữ chỗ, lock căn.
- `payment-service`: Chức năng thanh toán, cọc.

### Phase 5: Hỗ trợ & Khách hàng
Tạo NestJS apps:
- `notification-service`: Connect tới Email, SMS, Zalo.
- `crm-service`: Quản lý lead, funnel sales.
- `search-service`: Tích hợp ElasticSearch để search đa chiều.

### Phase 6: API Gateway & Tích hợp
- Tạo `api-gateway`: Hoạt động như một graph router đứng trước 10 microservices, tổng hợp các schema nhỏ (subgraph) thành một unified GraphQL API trọn vẹn.

---

Sau khi bạn duyệt, tôi sẽ tiến hành chạy từng Phase, mỗi thao tác sinh code hoàn tất, hệ thống sẽ thực thi tự động lệnh sinh mã Nest qua bộ công cụ của Nx.  

## Open Questions

> [!TIP]
> 1. Với cơ sở dữ liệu (Database), bạn dự định sẽ dùng công nghệ nào làm chủ đạo? (Ví dụ: PostgreSQL với TypeORM / Prisma, hay MongoDB?).
> 2. Việc tạo GraphQL modules tôi có nên generate code theo chuẩn Code-first của NestJS không? (Sử dụng các decorator `@ObjectType()`, `@Field()` trong TypeScript rồi tự sinh ra GraphQL schema).

## Verification Plan

### Verification Steps
- Chạy hệ thống với `npx nx run-many --target=build` để đảm bảo code của tất cả 11 apps (10 service + 1 gateway) đều compile thành công.
- Kiểm tra toàn bộ cấu trúc tree architecture của workspace.
