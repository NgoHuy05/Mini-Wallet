module.exports = {
  tableName: 'pockets',

  attributes: {
    id: { type: 'string', columnName: '_id' },
    type: { type: 'string', required: true, isIn: ['customer', 'biller', 'system', 'bank'] },
    ownerId: { type: 'string', allowNull: true },
    label: { type: 'string', required: true },
    currencyCode: { type: 'string', defaultsTo: 'VND' },
    balance: { type: 'number', defaultsTo: 0 },
    checksum: { type: 'string', required: true },
    status: { type: 'string', isIn: ['active', 'locked'], defaultsTo: 'active' },
    isLocked: { type: 'boolean', defaultsTo: false },
    lockedByTransRefId: { type: 'string', allowNull: true }
  }
};
