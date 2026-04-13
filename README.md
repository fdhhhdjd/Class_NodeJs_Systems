<p align="center">
  <a href="https://www.linkedin.com/in/tai-nguyen-tien-787545213/"><img src="https://img.icons8.com/color/48/000000/linkedin-circled--v1.png" alt="LinkedIn"></a>
  <a href="https://profile-forme.surge.sh"><img src="https://img.icons8.com/color/48/000000/internet--v1.png" alt="Website"></a>
  <a href="tel:0798805741"><img src="https://img.icons8.com/color/48/000000/apple-phone.png" alt="Phone"></a>
  <a href="mailto:nguyentientai10@gmail.com"><img src="https://img.icons8.com/fluency/48/000000/send-mass-email.png" alt="Email"></a>
</p>

<h1 align="center">Class NodeJS Systems</h1>

<p align="center">
  Khoá học online <strong>Backend &amp; System Design với Node.js</strong> — giảng viên <strong>Nguyễn Tiến Tài</strong>.
</p>

---

## 1. Giới thiệu

**Class NodeJS Systems** là repository tổng hợp source code, tài liệu và ví dụ thực hành cho khoá học **Node.js Backend & System Design**. Dự án được thiết kế như một backend thực tế để học viên có thể vừa đọc lý thuyết, vừa chạy code, vừa quan sát cách các thành phần của một hệ thống production tương tác với nhau.

Nội dung khoá học bao trùm các chủ đề:

- Kiến trúc backend chuẩn (layered: route → controller → service → model).
- Versioning API (`v1`, `v2`, `v3`) để học cách tiến hoá hệ thống.
- Cơ sở dữ liệu quan hệ (PostgreSQL, CockroachDB) với raw SQL, query builder (Knex) và migration.
- Caching, pub/sub, rate limiting với Redis.
- Authentication & Authorization: JWT, refresh token, cookie, blacklist token, OTP, verification email.
- Background jobs, cron, message/notification (Telegram bot, Email).
- Upload & xử lý ảnh với Cloudinary, Multer.
- Web scraping / render PDF với Puppeteer.
- Logging, monitoring và clustering.
- Bảo mật (Helmet, CORS, hashing, certificate / SSL).

## 2. Kiến trúc thư mục

```text
Class_NodeJs_Systems/
├── server.js              # Entry point khởi động HTTP server
├── primary.mjs            # Cluster mode (multi-process)
├── docker-compose.yml     # Postgres, Redis, ... cho môi trường dev
├── makefile               # Lệnh tắt thường dùng
├── migrations/            # SQL migration: users, todos, labels, otp, verification
├── newMap.js              # Lộ trình / mind map khoá học
├── demo.js                # Code demo nhanh trong các buổi học
├── zips/                  # Tài nguyên đóng gói
└── src/
    ├── app.js             # Khởi tạo express app, middleware, routes
    ├── apis/              # Tích hợp API bên thứ ba (Google, ...)
    ├── app/
    │   ├── v1/            # Phiên bản API 1: users, todos, labels
    │   ├── v2/            # Phiên bản API 2: users, images, notifications, puppeteer
    │   └── v3/            # Phiên bản API 3: telegram bot
    ├── auth/              # JWT, password, cookie, blacklist, middleware check auth
    ├── commons/           # configs, constants, helpers, keys, utils dùng chung
    ├── cores/             # Chuẩn hoá success / error response
    ├── crons/             # Cron jobs (dọn OTP, verification hết hạn, ...)
    ├── databases/         # Khởi tạo Postgres, Knex, Redis, Pub/Sub, Cloudinary, Firebase, Telegram
    ├── libs/              # Các thư viện nội bộ (HTTP method, ...)
    ├── loggers/           # Winston + daily rotate file
    ├── uploads/           # Thư mục lưu file upload tạm
    └── views/             # Handlebars templates: email OTP, reset password, ...
```

Mỗi version trong [src/app/](src/app/) đi theo pattern 4 lớp:

- `routes/` — định nghĩa endpoint, gắn middleware.
- `controllers/` — nhận request, validate, gọi service.
- `services/` — nghiệp vụ (business logic).
- `models/` — truy cập dữ liệu (PG / Knex).

## 3. Tài liệu lý thuyết trong repo

| File | Nội dung |
| --- | --- |
| [SQL.md](./SQL.md) | Kiến thức và bài tập SQL / RDBMS, index, transaction, tối ưu truy vấn |
| [REDIS.md](./REDIS.md) | Redis: caching, pub/sub, data structures, rate limit, lock |
| [LIBRARY.md](./LIBRARY.md) | Tổng hợp các thư viện Node.js thường dùng trong dự án thực tế |
| [BOT.md](./BOT.md) | Hướng dẫn xây dựng bot (Telegram, automation) |
| [CERT.md](./CERT.md) | Cấu hình SSL / chứng chỉ HTTPS |
| [NEWMAP.md](./NEWMAP.md) | Lộ trình học tập (roadmap) tổng thể |

## 4. Tính năng chính của source code

- **REST API đa phiên bản** (`/v1`, `/v2`, `/v3`) — dùng để minh hoạ cách tiến hoá API mà không phá vỡ client cũ.
- **Quản lý user**: đăng ký, đăng nhập, đổi mật khẩu, quên mật khẩu, xác thực email, OTP qua điện thoại.
- **Todo list & Label** (v1) — case study CRUD chuẩn với quan hệ many-to-many.
- **Upload ảnh** lên Cloudinary, lưu metadata, resize.
- **Notifications & Email** dùng Nodemailer + Handlebars template ([src/views/](src/views/)).
- **Telegram Bot** (v3) — gửi cảnh báo, log hệ thống.
- **Puppeteer** — scraping và xuất PDF.
- **Cron jobs** — định kỳ dọn OTP / verification hết hạn ([src/crons/](src/crons/)).
- **Logging** với Winston + daily rotate ([src/loggers/](src/loggers/)).
- **Cluster mode** với [primary.mjs](primary.mjs) để chạy đa tiến trình.

## 5. Yêu cầu môi trường

- **Node.js** >= 18
- **Docker** & **Docker Compose**
- **PostgreSQL** (hoặc **CockroachDB** Cloud)
- **Redis**
- Tài khoản **Cloudinary**, **Firebase**, **Telegram Bot** (nếu dùng các tính năng tương ứng)

## 6. Cài đặt & chạy

```bash
# 1. Clone repo
git clone https://github.com/fdhhhdjd/Class_NodeJs_Systems.git
cd Class_NodeJs_Systems

# 2. Cài dependencies
npm install

# 3. Tạo file cấu hình Firebase từ template
cp firebaseConfig.example.json firebaseConfig.json

# 4. Tạo file .env (xem các biến trong src/commons/configs)

# 5. Bật Postgres, Redis qua Docker
docker-compose up -d

# 6. Chạy migration trong thư mục migrations/ vào database

# 7. Khởi động server
npm run dev        # chạy với node --watch + log ioredis
# hoặc
npm run cluster    # chạy ở chế độ cluster nhiều process
# hoặc
npm start          # chạy production
```

## 7. Scripts có sẵn

| Script | Mô tả |
| --- | --- |
| `npm run dev` | Chạy `server.js` với `node --watch`, bật debug `ioredis` |
| `npm run cluster` | Chạy `primary.mjs` ở chế độ cluster (multi-process) |
| `npm run tai` | Chạy nhanh `server.js` với `--watch` |
| `npm run node` | Chạy bằng `nodemon` |

## 8. Tài nguyên tham khảo

- [CockroachDB Cloud](https://cockroachlabs.cloud/clusters)
- [CockroachDB + Node.js + Knex example](https://github.com/cockroachlabs/example-app-node-knex)
- [Knex.js](https://knexjs.org/)
- [PERN Store - Pg usage example](https://github.com/dhatGuy/PERN-Store/blob/main/server/db/auth.db.js)

## 9. Đối tượng phù hợp

- Lập trình viên đã biết Node.js cơ bản, muốn học sâu hơn về **backend & system design**.
- Sinh viên IT muốn có một code base thực tế để đọc và build theo.
- Developer chuyển từ frontend / fullstack muốn nắm vững phía server, database và DevOps cơ bản.

## 10. Maintainer

- **Nguyễn Tiến Tài** — [codewebkhongkho.com](https://codewebkhongkho.com)

Liên hệ công việc / hợp tác đào tạo: [https://codewebkhongkho.com](https://codewebkhongkho.com)

## 11. Ủng hộ tác giả

Nếu khoá học và source code hữu ích, bạn có thể ủng hộ một ly cà phê để tiếp thêm động lực ❤️

<p align="center">
  <img src="https://3.bp.blogspot.com/-SzGvXn2sTmw/V6k-90GH3ZI/AAAAAAAAIsk/Q678Pil-0kITLPa3fD--JkNdnJVKi_BygCLcB/s1600/cf10-fbc08%2B%25281%2529.gif" width="200" alt="Donate">
</p>

- **Chủ tài khoản:** NGUYEN TIEN TAI
- **Số tài khoản:** 1651002972052
- **Ngân hàng:** TMCP An Bình (ABBANK)

## 12. License

Phát hành phục vụ mục đích **học tập**. Vui lòng ghi nguồn khi sử dụng lại nội dung.

---

<p align="center">Thank you so much ❤️</p>
