// api/models/Customer.js
module.exports = {
  tableName: 'customers',
  attributes: {
    id: { type: 'string', columnName: '_id' },
    phone: { type: 'string', required: true, unique: true, regex: /^0\d{9}$/ },
    pinHash: { type: 'string', required: true, protect: true },
    pocketId: { type: 'string', required: true, unique: true },
    status: { type: 'string', isIn: ['active', 'locked'], defaultsTo: 'active' },
    lockedAt: { type: 'ref', columnType: 'datetime' },
    lockedReason: { type: 'string', allowNull: true }
  }
};
