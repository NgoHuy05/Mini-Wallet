# Mini-Wallet — Config-driven Payment Integration Engine

Hệ thống ví điện tử mô phỏng (Mini-Wallet) với engine tích hợp **config-driven**: cho phép kết nối thêm đối tác thanh toán/biller mới chỉ bằng cách khai báo cấu hình trong database, **không cần sửa code Backend**.

Dự án gồm 3 thành phần độc lập, chạy song song:

| Service | Vai trò | Công nghệ chính |
|---|---|---|
| `backend/` | Core banking + Integration Engine | Sails.js, MongoDB (sails-mongo), Socket.io, JWT, bcrypt |
| `frontend/` | Admin Dashboard / Ví điện tử UI | React 19, Vite, Tailwind CSS v4, Zustand, React Router, Axios, Socket.io-client |
| `biller-server/` | Giả lập đối tác thanh toán thứ 3 (mock biller) | Express, CORS, UUID |

---

## 1. Kiến trúc tổng quan

```
                ┌───────────────┐
                │   frontend    │  (React + Vite, port 5173)
                │ Admin/Pocket UI│
                └───────┬───────┘
                        │ REST API + WebSocket
                        ▼
                ┌───────────────┐        config-driven
                │    backend    │──────► đọc cấu hình đối tác
                │ (Sails.js API)│        từ MongoDB, tự map
                │  + Integration │        request/response
                │     Engine     │
                └───────┬───────┘
                        │ REST API (mô phỏng đối tác thật)
                        ▼
                ┌───────────────┐
                │ biller-server │  (Express, mock 3rd-party)
                │  (Giả lập)    │
                └───────────────┘
```

Backend đóng vai trò trung tâm: xử lý nghiệp vụ ví (tạo tài khoản, nạp/rút, chuyển tiền P2P), đồng thời chứa **Integration Engine** đọc cấu hình đối tác (URL, headers, template mapping, thuật toán ký số) từ MongoDB để tự động gọi sang `biller-server` mà không cần hard-code logic riêng cho từng đối tác.

---

## 2. Yêu cầu môi trường

- Node.js `^22.14` (theo `engines` trong `backend/package.json`)
- MongoDB đang chạy (local hoặc replica set nếu cần test transaction)
- npm (đi kèm Node.js)

---

## 3. Cài đặt

Clone repository và cài dependencies cho từng service:

```bash
git clone <repo-url>
cd <repo-name>

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Biller server (mock đối tác thứ 3)
cd ../biller-server
npm install
```

---

## 4. Cấu hình biến môi trường

Mỗi service cần file `.env` riêng (không commit lên Git — thêm vào `.gitignore`).

### `backend/.env`
```env
PORT=1337
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/mini-wallet
JWT_SECRET=your_jwt_secret_here
BILLER_SERVER_URL=http://localhost:4000
```

### `frontend/.env`
```env
VITE_API_BASE_URL=http://localhost:1337
VITE_SOCKET_URL=http://localhost:1337
```

### `biller-server/.env`
```env
PORT=4000
```

> Điều chỉnh giá trị cho đúng với môi trường thực tế của bạn.

---

## 5. Chạy dự án (development)

Mở 3 terminal riêng biệt:

```bash
# Terminal 1 — Biller server (nên chạy trước để backend có đối tác để gọi tới)
cd biller-server
npm run dev

# Terminal 2 — Backend (Sails.js)
cd backend
npm run dev

# Terminal 3 — Frontend
cd frontend
npm run dev
```

Mặc định:
- Backend: `http://localhost:1337`
- Frontend: `http://localhost:5173`
- Biller server: `http://localhost:4000`

---

## 6. Build production

```bash
# Frontend
cd frontend
npm run build      # output tại frontend/dist

# Backend
cd backend
NODE_ENV=production node app.js
```

---

## 7. Tính năng chính

### 7.1 Core banking
- Tạo tài khoản người dùng, nạp tiền, rút tiền.
- Chuyển tiền ngang hàng (P2P) nội bộ giữa hai tài khoản trong cùng hệ thống.
- Đảm bảo tính nhất quán số dư (balance) khi nhiều giao dịch cùng tác động vào một tài khoản tại cùng thời điểm (xử lý race condition).

### 7.2 Integration Engine — config-driven
- Thêm đối tác thanh toán/biller mới (URL, headers, template mapping request/response, thuật toán mã hóa SHA256/RSA...) hoàn toàn qua giao diện Admin — **không cần sửa hay deploy lại code Backend**.
- Áp dụng các Design Pattern để engine tổng quát hóa được cho nhiều đối tác khác nhau:
  - **Strategy Pattern**: chuyển đổi thuật toán/logic xử lý theo từng đối tác.
  - **Adapter Pattern**: chuẩn hóa dữ liệu thô từ đối tác về định dạng chuẩn nội bộ.
  - **Factory Pattern**: khởi tạo module kết nối tương ứng dựa trên cấu hình.
- Module `NeonMessage` điều phối luồng giao dịch nhiều bước: `RequestStep` → `ConfirmStep` → `VerifyStep`, phối hợp với `fieldBuilder` (build payload động theo template), `TransValidation` (kiểm tra hợp lệ dữ liệu) và `FeeCalculator` (tính phí giao dịch).
- **Hot-reload config**: khi cấu hình đối tác trong MongoDB thay đổi, hệ thống tự cập nhật cache ngay lập tức mà không cần restart server, giảm downtime khi thêm/sửa đối tác.
- Đã kiểm thử thành công với 2 đối tác mock có cấu trúc API hoàn toàn khác nhau, xác nhận engine tự động kết nối đúng chỉ bằng thao tác cấu hình trên UI.

### 7.3 Xử lý giao dịch an toàn (data consistency)
- Sổ cái ghi nhận theo mô hình bút toán kép (double-entry ledger) qua `glSteps`, đảm bảo mọi giao dịch đều có cặp ghi Nợ/Có cân bằng.
- Dùng MongoDB replica set + `session.withTransaction()` để đảm bảo tính toàn vẹn (atomicity) khi thực hiện nhiều thao tác ghi trong một giao dịch.
- Áp dụng compensating transaction pattern để rollback nghiệp vụ khi một bước trong chuỗi giao dịch thất bại.
- Sử dụng idempotency key để tránh xử lý trùng lặp khi client gửi lại cùng một request (network retry, double-click...).

### 7.4 Quản trị & phân quyền (Admin Dashboard)
- Giao diện React quản trị đối tác: `AdminService`/`AdminBillers` cho phép xem, thêm, sửa cấu hình đối tác trực quan, dữ liệu đồng bộ realtime với store (Zustand).
- Role-based access control (RBAC) phân quyền theo `userType`, kiểm soát chức năng nào được phép thao tác trên từng vai trò.
- Chuẩn hóa mã lỗi (`respCode`) để trả về thông báo lỗi dễ hiểu cho người dùng thay vì mã lỗi số thô.

### 7.5 Realtime
- Cập nhật trạng thái giao dịch, số dư tài khoản theo thời gian thực qua Socket.io, không cần người dùng tự refresh trang.

### 7.6 Biller server giả lập (mock third-party)
- Service Express độc lập, đóng vai trò một đối tác thanh toán thứ 3 để kiểm thử toàn bộ luồng tích hợp end-to-end mà không cần kết nối đối tác thật.
- Cho phép giả lập nhiều "hình dạng" API khác nhau (khác cấu trúc payload, khác cơ chế ký số) để kiểm chứng khả năng tổng quát hóa thực sự của Integration Engine.

---

## 8. Cấu trúc thư mục (tổng quan)

```
.
├── backend/         # Sails.js API + Integration Engine
├── frontend/         # React Admin Dashboard / Wallet UI
├── biller-server/    # Mock third-party biller (Express)
└── README.md
```

---

## 9. Ghi chú

- Đảm bảo `biller-server` được khởi động và cấu hình đúng URL trong MongoDB (bảng cấu hình đối tác) trước khi test luồng giao dịch tích hợp end-to-end.
- Khi thêm đối tác mới, chỉ cần tạo bản ghi cấu hình mới qua Admin Dashboard — Engine sẽ tự động nhận diện và xử lý mà không cần sửa code Backend.
