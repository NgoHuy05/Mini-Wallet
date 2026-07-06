## 1. Auth 

| Endpoint | Method | Body | Data trả về |
|----------|:---:|------|-------------|
| POST `/auth/customer/register` | POST | `phone`, `pin` | `token`, `customer` |
| POST `/auth/customer/login` | POST | `phone`, `pin` | `token` |
| POST `/auth/admin/login` | POST | `username`, `password` | `token` |

---

## 2. Customer — Ví & Lịch sử

| Endpoint | Method | Body | Data trả về |
|:---|:---:|:---|:---|
| `/pockets/me` | POST | — | `{ balance, currency }` |
| `/transactions/me` | POST | `page`, `limit` | `[Transaction]` |

> **Note:** `/pockets/me` tự động verify checksum trước khi trả balance.

---

## 3. Engine 3 Bước (Transaction)

| Endpoint | Method | Body | Data trả về |
|:---|:---:|:---|:---|
| `/transaction/request` | POST | `serviceCode`, `parameters` | `{ transRefId, amount, fee, totalAmount, preview }` |
| `/transaction/confirm` | POST | `transRefId` | `{ authMethod, transRefId }` |
| `/transaction/verify`  | POST | `transRefId`, `pin` | `Transaction` |
## 4. Admin — Config nghiệp vụ

### 4.1 Services (`/admin/services`)

| Endpoint | Body | Mục đích |
|----------|------|----------|
| POST `/admin/services/list` | `page`, `limit` | Danh sách nghiệp vụ |
| POST `/admin/services/detail` | `serviceId` | Chi tiết 1 nghiệp vụ |
| POST `/admin/services/create` | `code`, `name`, `type`, `auth`, `action`, `actionParams`, `fee`, `fieldBuilder` | Tạo nghiệp vụ mới |
| POST `/admin/services/update` | `serviceId`, ...fields | Cập nhật nghiệp vụ |
| POST `/admin/services/delete` | `serviceId` | Xoá nghiệp vụ |

### 4.2 Transaction Design (`/admin/services/:serviceId/design`)

| Endpoint | Body | Mục đích |
|----------|------|----------|
| POST `/admin/trans-fields/list` | `serviceId` | Danh sách TransField |
| POST `/admin/trans-fields/create` | `serviceId`, `fieldName`, `label`, `inputType`, `order`, `rules`, `errorCode` | Thêm field |
| POST `/admin/trans-fields/update` | `fieldId`, ...fields | Sửa field |
| POST `/admin/trans-fields/delete` | `fieldId` | Xoá field |
| POST `/admin/trans-validations/list` | `serviceId` | Danh sách TransValidation |
| POST `/admin/trans-validations/create` | `serviceId`, `order`, `validatorKey`, `validateFields`, `errorCode`, `errorMessage` | Thêm validation |
| POST `/admin/trans-validations/update` | `validationId`, ...fields | Sửa validation |
| POST `/admin/trans-validations/delete` | `validationId` | Xoá validation |
| POST `/admin/trans-definitions/detail` | `serviceId` | Xem glSteps |
| POST `/admin/trans-definitions/save` | `serviceId`, `glSteps[]` | Lưu toàn bộ glSteps |

### 4.3 Billers (`/admin/billers`)

| Endpoint | Body | Mục đích |
|----------|------|----------|
| POST `/admin/billers/list` | `page`, `limit` | Danh sách biller |
| POST `/admin/billers/detail` | `billerId` | Chi tiết biller |
| POST `/admin/billers/create` | `code`, `name`, `inquiryUrl`, `paymentUrl` | Tạo biller — tự động sinh Pocket biller |
| POST `/admin/billers/update` | `billerId`, ...fields | Cập nhật biller |

### 4.4 Customers (`/admin/users`)

| Endpoint | Body | Mục đích |
|----------|------|----------|
| POST `/admin/users/list` | `phone`, `page`, `limit` | Tra cứu danh sách customer |
| POST `/admin/users/detail` | `userId` | Chi tiết customer + Pocket |
| POST `/admin/users/lock` | `userId`, `lockedReason` | Khoá tài khoản customer |
| POST `/admin/users/unlock` | `userId` | Mở khoá tài khoản customer |

### 4.5 Pockets (`/admin/pockets`)

| Endpoint | Body | Mục đích |
|----------|------|----------|
| POST `/admin/pockets/list` | `type` (`system`/`bank`/`customer`/`biller`)| Danh sách ví System + Bank |
| POST `/admin/pockets/detail` | `pocketId` | Chi tiết ví + verify checksum |

### 4.6 Transaction Trails (`/admin/transaction-trails`)

| Endpoint | Body | Mục đích |
|----------|------|----------|
| POST `/admin/transaction-trails/list` | `page`, `limit`, `status` | Danh sách Trail — dùng để debug qua `transStepLog` |
| POST `/admin/transaction-trails/detail` | `transRefId` | Chi tiết Trail + từng bước log |

### 4.8 Transactions (`/admin/transactions`)

| Endpoint | Body | Mục đích |
|----------|------|----------|
| POST `/admin/transactions/list` | `page`, `limit` | Danh sách biên lai thành công |
| POST `/admin/transactions/detail` | `transRefId` | Chi tiết biên lai |

### 4.9 Pocket Entries (`/admin/pocket-entries`)

| Endpoint | Body | Mục đích |
|----------|------|----------|
| POST `/admin/pocket-entries/list` | `transRefId` hoặc `pocketId` | Xem chi tiết bút toán ghi sổ kép |

