# Hướng Dẫn Kích Hoạt Hệ Thống Qua Docker (BĐS Microservices)

Tài liệu này hướng dẫn cách "lên sóng" toàn bộ hệ thống 10 microservices, 1 API Gateway và 3 cơ sở hạ tầng nền tảng (Postgres, ElasticSearch, Redis) bằng Docker.

## Yêu cầu Hệ Thống
- Đã cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Hoặc Docker Engine + Docker Compose).
- Khuyên dùng RAM máy tính tối thiểu 8GB (ưu tiên 16GB) vì ElasticSearch và 11 container Node.js sẽ tốn tài nguyên.

---

## Bước 1: Build toàn bộ source code

Trước khi Docker có thể đóng gói Image, code của toàn bộ 11 project cần được build ra file JS (nằm trong thư mục `dist`). Vì sử dụng cơ chế Monorepo (Nx), bạn chỉ cần chạy 1 lệnh duy nhất ở màn hình terminal tại thư mục gốc của dự án (`C:\Users\catmu\Downloads\bds`):

```bash
npx nx run-many --target=build --all
```
*Lưu ý: Lệnh này sẽ build toàn bộ apps và lưu output vào folder `dist/apps/`.*

---

## Bước 2: Chạy Docker Compose

Tiếp tục mở Terminal ở thư mục gốc chứa file `docker-compose.yml` và chạy lệnh sau:

```bash
docker-compose up -d --build
```
- Dấu `--build` báo cho Docker biết cần đọc file `Dockerfile` gốc, rồi theo tham số `ARG APP=...` để nhặt thư mục dist tương ứng của mỗi app và nén vào Container.
- Dấu `-d` (detached) sẽ chạy nền toàn bộ hệ thống. Quá trình này có thể tốn 5 - 10 phút tải ElasticSearch và Postgres trong lần đầu.

---

## Bước 3: Theo dõi Log và Kiểm tra

Hệ thống sẽ chạy ngầm. Để biết hệ thống có hoạt động trơn tru không, bạn có thể xem Terminal log của Gateway (do Gateway kết nối đến cả 10 service):

```bash
docker-compose logs -f api-gateway
```
Hoặc xem log của toàn bộ hệ thống bằng lệnh:
```bash
docker-compose logs -f
```

### Các Endpoint chính sau khi build:
- **API Gateway (Public)**: `http://localhost:3000`
- **Postgres Database**: `localhost:5432` (User: `root` / Pass: `password`)
- **Redis Cache**: `localhost:6379`
- **ElasticSearch**: `localhost:9200`
- **Các Microservice (Auth, User...)**: KHÔNG THỂ truy cập trực tiếp từ máy tính của bạn (bảo mật), toàn bộ giao tiếp phải thông qua Gateway hoặc gọi ngầm nhau qua Network tên là `bds_net` trong nội bộ Docker.

---

## Troubleshooting (Gỡ rối)

- Nếu sau khi gọi lệnh `docker-compose up` mà báo lỗi một service nào đó không có `package.json`, **hãy kiểm tra lại Bước 1** để đảm bảo quá trình build (npx nx build) đã thực sự thành công.
- Tắt hệ thống:
  ```bash
  docker-compose down
  ```
- Tắt và xóa luôn Data Database cũ:
  ```bash
  docker-compose down -v
  ```
