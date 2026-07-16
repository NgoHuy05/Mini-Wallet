# ERD - sơ đồ quan hệ
<img width="1246" height="1180" alt="db-mini-wallet" src="https://github.com/user-attachments/assets/331a693d-2535-4f63-8a38-191a2b8e67e9" />


# Database Models Overview

Hệ thống sử dụng **12 model** chính, được mô tả chi tiết dưới đây.

---
## `customers` – Khách hàng

Thông tin khách hàng cá nhân, gắn với một pocketId.

| Trường | Kiểu | Ràng buộc | Mô tả |
|--------|:----:|-----------|-------|
| `id` | `string` | `columnName: '_id'` | ID định danh |
| `phone` | `string` | `required, unique`<br>`regex: /^0\d{9}$/` | Số điện thoại (10 số, bắt đầu bằng 0) |
| `pinHash` | `string` | `required`<br>`protect: true` | Hash mã PIN (bảo vệ, không trả về API) |
| `pocketId` | `string` | `required, unique` | ID ví khách hàng → `pockets` |
| `status` | `string` | `enum: active, locked`<br>`default: active` | Trạng thái tài khoản |
| `lockedAt` | `datetime` | `optional` | Thời điểm bị khóa |
| `lockedReason` | `string` | `optional` | Lý do khóa |

---

## `officers` – Nhân viên vận hành hệ thống.

| Trường | Kiểu | Ràng buộc | Mô tả |
|--------|:----:|-----------|-------|
| `id` | `string` | `columnName: '_id'` | ID định danh |
| `username` | `string` | `required, unique` | Tên đăng nhập |
| `passwordHash` | `string` | `required`<br>`protect: true` | Hash mật khẩu (bảo vệ) |
| `displayName` | `string` | `optional` | Tên hiển thị |
| `status` | `string` | `enum: active, locked`<br>`default: active` | Trạng thái nhân viên |

---

## `billers` – Nhà cung cấp dịch vụ

Thông tin nhà cung cấp dịch vụ thanh toán hóa đơn.

| Trường | Kiểu | Ràng buộc | Mô tả |
|--------|:----:|-----------|-------|
| `id` | `string` | `columnName: '_id'` | ID định danh |
| `code` | `string` | `required, unique` | Mã nhà cung cấp (duy nhất) |
| `name` | `string` | `required` | Tên nhà cung cấp |
| `inquiryUrl` | `string` | `required` | URL tra cứu hóa đơn |
| `paymentUrl` | `string` | `required` | URL thanh toán hóa đơn |
| `pocketId` | `string` | `required` | ID ví biller → `pockets` |
| `status` | `string` | `enum: active, locked`<br>`default: active` | Trạng thái hoạt động |

---


## `pockets` – Ví

Lưu thông tin các loại ví (khách hàng, nhà cung cấp, hệ thống, ngân hàng).

| Trường | Kiểu | Ràng buộc | Mô tả |
|--------|:----:|-----------|-------|
| `id` | `string` | `columnName: '_id'` | ID định danh |
| `type` | `string` | `required`<br>`enum: customer, biller, system, bank` | Loại ví |
| `ownerId` | `string` | `optional` | ID chủ sở hữu (customerId / billerId / null với system) |
| `label` | `string` | `required` | Nhãn hiển thị (tên ví) |
| `currencyCode` | `string` | `default: 'VND'` | Mã tiền tệ |
| `balance` | `number` | `default: 0` | Số dư hiện tại |
| `checksum` | `string` | `required` | Checksum đảm bảo toàn vẹn số dư |
| `status` | `string` | `enum: active, locked`<br>`default: active` | Trạng thái ví |
| `isLocked` | `boolean` | `default: false` | Cờ khóa tạm thời (tránh chi tiêu khi giao dịch) |
| `lockedByTransRefId` | `string` | `optional` | Mã giao dịch đang khóa ví |

---

## `pocket_entries` – Bút toán ví

Ghi nhận bút toán kép (debit/credit) cho từng bước GL.

| Trường | Kiểu | Ràng buộc | Mô tả |
|--------|:----:|-----------|-------|
| `id` | `string` | `columnName: '_id'` | ID định danh |
| `transRefId` | `string` | `required` | Mã tham chiếu giao dịch |
| `glStepOrder` | `number` | `required` | Thứ tự bước GL → `trans_definitions` |
| `debitPocketId` | `string` | `required` | Ví ghi Nợ |
| `creditPocketId` | `string` | `required` | Ví ghi Có |
| `amount` | `number` | `required` | Số tiền bút toán |
| `currencyCode` | `string` | `default: 'VND'` | Mã tiền tệ |
| `status` | `string` | `enum: settled, failed, reversed`<br>`default: settled` | Trạng thái bút toán |

---

## `services` – Dịch vụ

Định nghĩa dịch vụ (P2P, cash-in, billpayment) với cấu hình phí, auth, field builder và action.

| Trường | Kiểu | Ràng buộc | Mô tả |
|--------|:----:|-----------|-------|
| `id` | `string` | `columnName: '_id'` | ID định danh |
| `code` | `string` | `required, unique` | Mã dịch vụ |
| `name` | `string` | `required` | Tên dịch vụ |
| `type` | `string` | `required`<br>`enum: p2p, cashin, billpayment` | Loại dịch vụ |
| `action` | `string` | `enum: none, billerTrans`<br>`default: none` | Hành động đặc biệt (gọi API biller) |
| `actionParams` | `json` | `default: {}` | Tham số cho action |
| `auth` | `string` | `required`<br>`enum: PIN, NONE` | Phương thức xác thực |
| `fee` | `json` | `required` | Cấu trúc phí (fixed / percentage / tier) |
| `fieldBuilder` | `json` | `required` | Định nghĩa cách build form nhập liệu |
| `status` | `string` | `enum: active, inactive`<br>`default: inactive` | Trạng thái dịch vụ |

---

## `trans_fields` – Định nghĩa trường dữ liệu

Mỗi trường dùng để build form nhập liệu cho một dịch vụ.

| Trường | Kiểu | Ràng buộc | Mô tả |
|--------|:----:|-----------|-------|
| `id` | `string` | `columnName: '_id'` | ID định danh |
| `serviceId` | `string` | `required` | ID dịch vụ sở hữu trường |
| `fieldName` | `string` | `required` | Tên trường (dùng trong payload) |
| `label` | `string` | `required` | Nhãn hiển thị |
| `description` | `string` | `optional` | Mô tả thêm |
| `inputType` | `string` | `required`<br>`enum: text, number, phone, select` | Loại input |
| `isRequired` | `boolean` | `default: true` | Trường bắt buộc? |
| `needSecured` | `boolean` | `default: false` | Cần mã hóa/bảo mật? |
| `order` | `number` | `required` | Thứ tự hiển thị |
| `rules` | `json` | `optional` | Quy tắc validation (regex, min, max...) |
| `errorCode` | `string` | `optional` | Mã lỗi tùy chỉnh |

---

## `trans_validations` – Quy tắc validation

Định nghĩa các quy tắc validation tổng hợp.

| Trường | Kiểu | Ràng buộc | Mô tả |
|--------|:----:|-----------|-------|
| `id` | `string` | `columnName: '_id'` | ID định danh |
| `serviceId` | `string` | `required` | ID dịch vụ áp dụng |
| `order` | `number` | `required` | Thứ tự thực hiện validation |
| `validatorKey` | `string` | `required` | Tên validator (để gọi logic) |
| `validateFields` | `string` | `required` | Danh sách trường áp dụng (cách nhau bởi dấu phẩy) |
| `errorCode` | `string` | `optional` | Mã lỗi (nếu có) |
| `errorMessage` | `string` | `required` | Thông báo lỗi hiển thị |

---

## `trans_definitions` – Định nghĩa bước GL

Cấu hình các bước ghi sổ (GL steps) cho một dịch vụ.

| Trường | Kiểu | Ràng buộc | Mô tả |
|--------|:----:|-----------|-------|
| `id` | `string` | `columnName: '_id'` | ID định danh |
| `serviceId` | `string` | `required, unique` | ID dịch vụ (mỗi dịch vụ chỉ có một định nghĩa GL) |
| `glSteps` | `json` | `required` | Mảng các bước GL (debit, credit, amount, order...) |

---
## `transactions` – Giao dịch chính

Lưu thông tin tổng quan của một giao dịch: loại, số tiền, phí, ví liên quan và trạng thái.

| Trường | Kiểu | Ràng buộc | Mô tả |
|--------|:----:|-----------|-------|
| `id` | `string` | `columnName: '_id'` | ID định danh (ObjectId) |
| `transRefId` | `string` | `required, unique` | Mã tham chiếu giao dịch (duy nhất) |
| `transCode` | `string` | `required, unique` | Mã giao dịch (hệ thống sinh) |
| `serviceId` | `string` | `required` | ID dịch vụ → `services` |
| `transactionType` | `string` | `required`<br>`enum: p2p, cashin, billpayment` | Loại giao dịch |
| `message` | `string` | `maxLength: 255`<br>`default: ''` | Lời nhắn / ghi chú |
| `amount` | `number` | `required` | Số tiền gốc |
| `fee` | `number` | `required` | Phí giao dịch |
| `total` | `number` | `required` | Tổng = amount + fee |
| `currencyCode` | `string` | `default: 'VND'` | Mã tiền tệ |
| `senderPocketId` | `string` | `required` | Ví người gửi → `pockets` |
| `receiverPocketId` | `string` | `optional` | Ví người nhận (nếu có) |
| `billerPocketId` | `string` | `optional` | Ví nhà cung cấp (biller) |
| `systemPocketId` | `string` | `optional` | Ví hệ thống (phí, hoàn tiền) |
| `billerCode` | `string` | `optional` | Mã nhà cung cấp (billpayment) |
| `billCode` | `string` | `optional` | Mã hóa đơn (billpayment) |
| `billerRefId` | `string` | `optional` | ID tham chiếu từ nhà cung cấp |
| `triggeredById` | `string` | `required` | Người thực hiện (customer/officer) |
| `status` | `string` | `enum: processing, done, failed, reversed`<br>`default: processing` | Trạng thái giao dịch |

---

## `transaction_trails` – Dấu vết giao dịch

Lưu lịch sử xử lý, input/output payload, log chi tiết từng bước.

| Trường | Kiểu | Ràng buộc | Mô tả |
|--------|:----:|-----------|-------|
| `id` | `string` | `columnName: '_id'` | ID định danh |
| `transRefId` | `string` | `required, unique` | Mã tham chiếu (liên kết 1-1 với `transactions`) |
| `serviceId` | `string` | `required` | ID dịch vụ |
| `triggeredById` | `string` | `required` | Người kích hoạt |
| `status` | `string` | `required`<br>`enum: init, pending, confirmed, processing, done, failed, cancelled, expired`<br>`default: init` | Trạng thái trail |
| `expiredAt` | `datetime` | `optional` | Thời điểm hết hạn (chờ xác nhận) |
| `inputMessage` | `json` | `required` | Payload đầu vào từ client |
| `outputMessage` | `json` | `default: {}` | Phản hồi từ bên thứ 3 / hệ thống |
| `feeSnapshot` | `json` | `default: {}` | Ảnh chụp cấu trúc phí tại thời điểm tạo |
| `preview` | `json` | `optional` | Dữ liệu xem trước (màn hình confirm) |
| `failureReason` | `string` | `optional` | Lý do thất bại (nếu có) |
| `confirmedPinHash` | `string` | `optional` | Hash PIN xác nhận (nếu có) |
| `transStepLog` | `json` | `default: []` | Mảng log chi tiết từng bước xử lý |

---


## `currencies` – Tiền tệ

Danh mục tiền tệ được hỗ trợ.

| Trường | Kiểu | Ràng buộc | Mô tả |
|--------|:----:|-----------|-------|
| `id` | `string` | `columnName: '_id'` | ID định danh |
| `code` | `string` | `required, unique` | Mã tiền tệ (ISO 4217: VND, USD...) |
| `name` | `string` | `required` | Tên tiền tệ |
| `symbol` | `string` | `required` | Ký hiệu (₫, $...) |
| `status` | `string` | `enum: active, inactive`<br>`default: active` | Trạng thái |

---


## Mối quan hệ giữa các bảng

- `services` ↔ `trans_fields`, `trans_validations`, `trans_definitions` (1-n, 1-1)
- `transactions` ↔ `transaction_trails` (1-1 qua `transRefId`)
- `transactions` ↔ `pocket_entries` (1-n)
- `customers` ↔ `pockets` (1-1 qua `pocketId`)
- `billers` ↔ `pockets` (1-1 qua `pocketId`)
- `pockets` ↔ `pocket_entries` (1-n)
