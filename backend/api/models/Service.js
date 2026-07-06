module.exports = {
  tableName: 'services',

  attributes: {
    id: { type: 'string', columnName: '_id' },
    code: { type: 'string', required: true, unique: true },
    name: { type: 'string', required: true },
    type: { type: 'string', required: true, isIn: ['p2p', 'cashin', 'billpayment'] },
    action: { type: 'string', isIn: ['none', 'billerTrans'], defaultsTo: 'none' },
    actionParams: { type: 'json', defaultsTo: {} },
    auth: { type: 'string', required: true, isIn: ['PIN', 'NONE'] },
    fee: { type: 'json', required: true },
    fieldBuilder: { type: 'json', required: true },
    status: { type: 'string', isIn: ['active', 'inactive'], defaultsTo: 'active' }
  }
};
