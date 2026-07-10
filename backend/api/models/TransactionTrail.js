// api/models/TransactionTrail.js
module.exports = {
  tableName: 'transaction_trails',

  attributes: {
    id: { type: 'string', columnName: '_id' },
    transRefId: { type: 'string', required: true, unique: true },
    serviceId: { type: 'string', required: true },
    triggeredById: { type: 'string', required: true },
    status: {
      type: 'string',
      isIn: ['init', 'pending', 'confirmed', 'processing', 'done', 'failed', 'cancelled', 'expired'],
      defaultsTo: 'init'
    },
    expiredAt: { type: 'ref', columnType: 'datetime' },
    inputMessage: { type: 'json', required: true },
    outputMessage: { type: 'json', defaultsTo: {} },
    feeSnapshot: { type: 'json', defaultsTo: {} },
    preview: { type: 'json' },
    failureReason: { type: 'string', allowNull: true },
    confirmedPinHash: { type: 'string', allowNull: true },
    transStepLog: { type: 'json', defaultsTo: [] }
  }
};
