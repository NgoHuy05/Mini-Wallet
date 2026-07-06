module.exports = {
  tableName: 'billers',

  attributes: {
    id: { type: 'string', columnName: '_id' },
    code: { type: 'string', required: true, unique: true },
    name: { type: 'string', required: true },
    inquiryUrl: { type: 'string', required: true },
    paymentUrl: { type: 'string', required: true },
    pocketId: { type: 'string', required: true },
    status: { type: 'string', isIn: ['active', 'locked'], defaultsTo: 'active' }
  }
};
