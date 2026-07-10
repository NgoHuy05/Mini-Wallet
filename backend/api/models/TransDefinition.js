module.exports = {
  tableName: 'trans_definitions',

  attributes: {
    id: { type: 'string', columnName: '_id' },
    serviceId: { type: 'string', required: true, unique: true },
    glSteps: { type: 'json', required: true }
  }
};
