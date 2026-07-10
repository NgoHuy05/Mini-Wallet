module.exports = {
  tableName: 'trans_fields',

  attributes: {
    id: { type: 'string', columnName: '_id' },
    serviceId: { type: 'string', required: true },
    fieldName: { type: 'string', required: true },
    label: { type: 'string', required: true },
    description: { type: 'string' },
    inputType: { type: 'string', required: true, isIn: ['text', 'number', 'phone', 'select'] },
    isRequired: { type: 'boolean', defaultsTo: true },
    needSecured: { type: 'boolean', defaultsTo: false },
    order: { type: 'number', required: true },
    rules: { type: 'json' },
    errorCode: { type: 'string' }
  }
};
