module.exports = {
  tableName: 'trans_validations',

  attributes: {
    id: { type: 'string', columnName: '_id' },
    serviceId: { type: 'string', required: true },
    order: { type: 'number', required: true },
    validatorKey: { type: 'string', required: true },
    validateFields: { type: 'string', required: true },
    errorCode: { type: 'string' },
    errorMessage: { type: 'string', required: true }
  }
};
