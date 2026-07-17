// src/constants/suggestions.js

export const FIELD_NAME_SUGGESTIONS = [
  'SENDERID', 'RECEIVERID', 'AMOUNT', 'CURRENCY', 'DEBITFEE', 'TOTALAMOUNT',
  'BILLERCODE', 'BILLCODE', 'BILLERID', 'BILLER_POCKET_ID', 'SYSTEM_POCKET_ID',
];

export const REGEX_SUGGESTIONS = [
  '^0\\d{9}$',
];

export const VARIABLE_SUGGESTIONS = [
  'SENDERID', 'RECEIVERID', 'AMOUNT', 'CURRENCY', 'DEBITFEE', 'TOTALAMOUNT',
  'BILLERCODE', 'BILLCODE', 'BILLERID', 'BILLER_POCKET_ID', 'SYSTEM_POCKET_ID',
];

export const QUERY_SUGGESTIONS = [
  'queryPocketByCustomerId', 'queryPocketByPhone', 'queryBillerByCode',
  'queryPocketByBillerId', 'billerInquiry',
];

export const SOURCE_SUGGESTIONS = [
  'customerId', 'receiverPhone', 'parameters.amount', 'parameters.billerCode',
  'parameters.billCode', 'VND', 'BILLERCODE', 'BILLERID', 'userId',
];

export const LEVEL_SUGGESTIONS = ['productLevel', 'pocket'];

export const TARGET_SUGGESTIONS = [
  'SENDERID', 'RECEIVERID', 'BILLER_POCKET_ID', 'SYSTEM_POCKET_ID',
];

export const AMOUNT_SUGGESTIONS = ['AMOUNT', 'DEBITFEE'];

export const VALIDATOR_KEY_SUGGESTIONS = [
  'validateReceiverExists',
  'validateReceiverIsNotSender',
  'validateSenderNotLocked',
  'validateSenderAccountSufficiency',
  'validateBankSufficiency',
  'validateBillerActive',
  'validateBillInquirySuccess',
];

// Error Code Map (code -> message tiếng Việt)
export const ERROR_CODE_MAP = {
  // Generic validation (4xxx)
  '4001': 'Thiếu trường bắt buộc',
  '4002': 'Số không hợp lệ',
  '4003': 'Giá trị quá nhỏ',
  '4004': 'Giá trị quá lớn',
  '4005': 'Quá ngắn',
  '4006': 'Quá dài',
  '4007': 'Định dạng không hợp lệ',
  '4008': 'Tùy chọn không hợp lệ',
  '4009': 'Số tiền không hợp lệ',
  // Business validation (41xx)
  '4101': 'Người nhận không tồn tại',
  '4102': 'Không thể chuyển cho chính mình',
  '4103': 'Ví người gửi bị khóa',
  '4104': 'Người gửi không tồn tại',
  '4105': 'Số dư không đủ',
  '4106': 'Ví ngân hàng không tồn tại',
  '4107': 'Ví ngân hàng không đủ số dư',
  '4108': 'Biller bị khóa',
  '4109': 'Hóa đơn không tồn tại',
  // Auth (1xxx)
  '1001': 'Khách hàng không tồn tại',
  '1002': 'Tài khoản bị khóa',
  '1003': 'Mã PIN không đúng',
  '1004': 'Yêu cầu mã PIN',
  '1005': 'Xác thực thất bại',
  // Service (2xxx)
  '2001': 'Dịch vụ không tồn tại hoặc không hoạt động',
  '2002': 'Biller không tồn tại hoặc không hoạt động',
  '2003': 'Biller không hoạt động',
  '2004': 'Truy vấn hóa đơn thất bại',
  '2005': 'Thanh toán hóa đơn thất bại',
  // Transaction flow (3xxx)
  '3001': 'Thiếu transRefId',
  '3002': 'Không tìm thấy giao dịch đang chờ',
  '3003': 'Giao dịch đã hết hạn',
  '3004': 'Không tìm thấy giao dịch đã xác nhận',
  '3005': 'Giao dịch đã được xử lý',
  '3006': 'Giao dịch đã bị hủy',
  // Resources (42xx)
  '4201': 'Không tìm thấy tài nguyên',
  '4202': 'Dữ liệu đã tồn tại',
  '4203': 'Truy cập bị từ chối',
  // System (9xxx)
  '9999': 'Lỗi máy chủ nội bộ',
  '9998': 'Lỗi cơ sở dữ liệu',
  '9997': 'Lỗi mạng',
};

export const ERROR_CODE_OPTIONS = Object.keys(ERROR_CODE_MAP);
export const ERROR_MESSAGE_OPTIONS = Object.values(ERROR_CODE_MAP);