module.exports.custom = {
  respCode: {
    SUCCESS: { code: 200, message: 'Thành công' },

    // Auth (1xxx)
    ERR_CUSTOMER_NOT_FOUND:    { code: 1001, message: 'Khách hàng không tồn tại' },
    ERR_ACCOUNT_LOCKED:        { code: 1002, message: 'Tài khoản bị khóa' },
    ERR_WRONG_PIN:             { code: 1003, message: 'Mã PIN không đúng' },
    ERR_PIN_REQUIRED:          { code: 1004, message: 'Yêu cầu mã PIN' },
    ERR_AUTH_FAILED:           { code: 1005, message: 'Xác thực thất bại' },

    // Service (2xxx)
    SERVICE_NOT_FOUND_OR_INACTIVE: { code: 2001, message: 'Dịch vụ không tồn tại hoặc không hoạt động' },
    BILLER_NOT_FOUND:              { code: 2002, message: 'Biller không tồn tại hoặc không hoạt động' },
    BILLER_INACTIVE:               { code: 2003, message: 'Biller không hoạt động' },
    INQUIRY_FAILED:                { code: 2004, message: 'Truy vấn hóa đơn thất bại' },
    PAYMENT_FAILED:                { code: 2005, message: 'Thanh toán hóa đơn thất bại' },

    // Transaction flow (3xxx)
    MISSING_TRANS_REF_ID:             { code: 3001, message: 'Thiếu transRefId' },
    TRAIL_NOT_FOUND_OR_NOT_PENDING:   { code: 3002, message: 'Không tìm thấy giao dịch đang chờ' },
    TRAIL_EXPIRED:                    { code: 3003, message: 'Giao dịch đã hết hạn' },
    TRAIL_NOT_FOUND_OR_NOT_CONFIRMED: { code: 3004, message: 'Không tìm thấy giao dịch đã xác nhận' },
    TRANSACTION_ALREADY_PROCESSED:    { code: 3005, message: 'Giao dịch đã được xử lý' },
    TRANSACTION_CANCELLED:            { code: 3006, message: 'Giao dịch đã bị hủy' },

    // Generic validation (4xxx)
    MISSING_FIELD:         { code: 4001, message: 'Thiếu trường bắt buộc' },
    INVALID_NUMBER:        { code: 4002, message: 'Số không hợp lệ' },
    MIN_VALUE:             { code: 4003, message: 'Giá trị quá nhỏ' },
    MAX_VALUE:             { code: 4004, message: 'Giá trị quá lớn' },
    MIN_LENGTH:            { code: 4005, message: 'Quá ngắn' },
    MAX_LENGTH:            { code: 4006, message: 'Quá dài' },
    INVALID_FORMAT:        { code: 4007, message: 'Định dạng không hợp lệ' },
    INVALID_OPTION:        { code: 4008, message: 'Tùy chọn không hợp lệ' },

    // Business validation (41xx)
    ERR_RECEIVER_NOT_FOUND:   { code: 4101, message: 'Người nhận không tồn tại' },
    ERR_SELF_TRANSFER:        { code: 4102, message: 'Không thể chuyển cho chính mình' },
    ERR_SENDER_LOCKED:        { code: 4103, message: 'Ví người gửi bị khóa' },
    ERR_SENDER_NOT_FOUND:     { code: 4104, message: 'Người gửi không tồn tại' },
    ERR_INSUFFICIENT_BALANCE: { code: 4105, message: 'Số dư không đủ' },
    ERR_BANK_NOT_FOUND:       { code: 4106, message: 'Ví ngân hàng không tồn tại' },
    ERR_BANK_INSUFFICIENT:    { code: 4107, message: 'Ví ngân hàng không đủ số dư' },
    ERR_BILLER_LOCKED:        { code: 4108, message: 'Biller bị khóa' },
    ERR_BILL_NOT_FOUND:       { code: 4109, message: 'Hóa đơn không tồn tại' },

    // Resources (42xx)
    ERR_NOT_FOUND:   { code: 4201, message: 'Không tìm thấy tài nguyên' },
    ERR_DUPLICATE:   { code: 4202, message: 'Dữ liệu đã tồn tại' },
    ERR_FORBIDDEN:   { code: 4203, message: 'Truy cập bị từ chối' },

    // System (9xxx)
    INTERNAL_ERROR: { code: 9999, message: 'Lỗi máy chủ nội bộ' },
    DATABASE_ERROR: { code: 9998, message: 'Lỗi cơ sở dữ liệu' },
    NETWORK_ERROR:  { code: 9997, message: 'Lỗi mạng' },

    throw: function (codeObj, customMessage) {
      const msg = customMessage || (codeObj && codeObj.message) || 'Lỗi không xác định';
      const code = (codeObj && codeObj.code) ? codeObj.code : 9999;
      throw Object.assign(new Error(msg), { code });
    },
  },
};
