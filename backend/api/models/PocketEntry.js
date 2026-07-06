module.exports = {
  tableName: 'pocket_entries',

  attributes: {
    id: { type: 'string', columnName: '_id' },
    transRefId: { type: 'string', required: true },
    glStepOrder: { type: 'number', required: true },
    debitPocketId: { type: 'string', required: true },
    creditPocketId: { type: 'string', required: true },
    amount: { type: 'number', required: true },
    currencyCode: { type: 'string', defaultsTo: 'VND' },
    status: { type: 'string', isIn: ['settled', 'failed', 'reversed'], defaultsTo: 'settled' }
  }
};
