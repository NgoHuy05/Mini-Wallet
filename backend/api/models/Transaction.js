module.exports = {
  tableName: 'transactions',

  attributes: {
    id: { type: 'string', columnName: '_id' },
    transRefId: { type: 'string', required: true, unique: true },
    serviceId: { type: 'string', required: true },
    transactionType: {
      type: 'string',
      required: true,
      isIn: [
        'p2p',
        'cashin',
        'billpayment',
      ]
    },
    message: {
      type: 'string',
      allowNull: true,
      maxLength: 255,
      defaultsTo: ''
    },
    amount: { type: 'number', required: true },
    fee: { type: 'number', required: true },
    total: { type: 'number', required: true },
    currencyCode: { type: 'string', defaultsTo: 'VND' },
    senderPocketId: { type: 'string', required: true },
    receiverPocketId: { type: 'string', allowNull: true },
    billerPocketId: { type: 'string', allowNull: true },
    systemPocketId: { type: 'string', allowNull: true },
    billerCode: { type: 'string', allowNull: true },
    billCode: { type: 'string', allowNull: true },
    billerRefId: { type: 'string', allowNull: true },
    triggeredById: { type: 'string', required: true },
    status: {
      type: 'string',
      isIn: ['processing', 'done', 'failed', 'reversed'],
      defaultsTo: 'processing'
    }
  }
};
