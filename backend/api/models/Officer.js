module.exports = {
  tableName: 'officers',

  attributes: {
    id: { type: 'string', columnName: '_id' },
    username: { type: 'string', required: true, unique: true },
    passwordHash: { type: 'string', required: true, protect: true },
    displayName: { type: 'string' },
    status: { type: 'string', isIn: ['active', 'locked'], defaultsTo: 'active' }
  }
};
