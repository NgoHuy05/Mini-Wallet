module.exports = {
  tableName: 'currencies',

  attributes: {
    id: { type: 'string', columnName: '_id' },
    code: { type: 'string', required: true, unique: true },
    name: { type: 'string', required: true },
    symbol: { type: 'string', required: true },
    status: { type: 'string', isIn: ['active', 'inactive'], defaultsTo: 'active' }
  }
};
