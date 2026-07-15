
module.exports = {
  tableName: 'notifications',

  attributes: {
    // ID người nhận (chủ ví) - liên kết với Customer hoặc User
    userId: {
      type: 'string',
      required: true,
      description: 'ID của người nhận thông báo (chủ ví)'
    },

    // ID giao dịch (tham chiếu đến Transaction)
    transactionId: {
      type: 'string',
      allowNull: true,
      description: 'ID của giao dịch liên quan (nếu có)'
    },

    // Loại thông báo: credit (cộng tiền) hoặc debit (trừ tiền)
    type: {
      type: 'string',
      isIn: ['credit', 'debit'],
      required: true,
      description: 'credit: nhận tiền, debit: trừ tiền'
    },

    // Số tiền giao dịch
    amount: {
      type: 'number',
      required: true,
      description: 'Số tiền (đơn vị VND)'
    },

    // Mã giao dịch (transRefId) - dùng để tham chiếu và hiển thị
    transRefId: {
      type: 'string',
      required: true,
      description: 'Mã giao dịch (transRefId)'
    },

    // Nội dung ngắn (ví dụ: "Chuyển tiền cho Nguyễn Văn A")
    content: {
      type: 'string',
      allowNull: true,
      maxLength: 255,
      description: 'Nội dung mô tả thêm'
    },

    // Thông báo đã định dạng sẵn để hiển thị
    message: {
      type: 'string',
      required: true,
      description: 'Thông báo chi tiết đã định dạng (ví dụ: "Tài khoản của bạn đã được cộng 100,000 VND. Mã GD: ...")'
    },

    // Đánh dấu đã đọc
    isRead: {
      type: 'boolean',
      defaultsTo: false,
      description: 'Đã được người dùng đọc hay chưa'
    }
  },

  // Tạo index để truy vấn nhanh theo userId + createdAt
  afterRegister: function() {
    this.native((err, collection) => {
      if (err) { return; }
      collection.createIndex({ userId: 1, createdAt: -1 });
    });
  }
};
