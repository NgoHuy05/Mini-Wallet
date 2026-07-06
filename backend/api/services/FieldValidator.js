// api/services/FieldValidator.js

module.exports = {
  validate: async (serviceId, transbody) => {
    const fields = await TransField.find({ serviceId }).sort('order ASC');

    const throwFieldError = (defaultCodeObj, field) => {
      const err = new Error(field.description || defaultCodeObj.message);
      err.code = field.errorCode || defaultCodeObj.code;
      throw err;
    };

    for (const field of fields) {
      const value = transbody[field.fieldName];
      const rules = field.rules || {};

      if (field.isRequired && (value === undefined || value === null || value === '')) {
        throwFieldError(sails.config.custom.respCode.MISSING_FIELD, field);
      }

      if (value === undefined || value === null || value === '') {
        continue;
      }

      switch (field.inputType) {
        case 'number': {
          const num = Number(value);
          if (isNaN(num)) {
            throwFieldError(sails.config.custom.respCode.INVALID_NUMBER, field);
          }
          if (rules.minValue !== undefined && num < rules.minValue) {
            throwFieldError(sails.config.custom.respCode.MIN_VALUE, field);
          }
          if (rules.maxValue !== undefined && num > rules.maxValue) {
            throwFieldError(sails.config.custom.respCode.MAX_VALUE, field);
          }
          break;
        }
        case 'text':
        case 'phone': {
          const str = String(value);
          if (rules.minLength !== undefined && str.length < rules.minLength) {
            throwFieldError(sails.config.custom.respCode.MIN_LENGTH, field);
          }
          if (rules.maxLength !== undefined && str.length > rules.maxLength) {
            throwFieldError(sails.config.custom.respCode.MAX_LENGTH, field);
          }
          if (rules.regex && !new RegExp(rules.regex).test(str)) {
            throwFieldError(sails.config.custom.respCode.INVALID_FORMAT, field);
          }
          break;
        }
        case 'select': {
          const options = (rules.options || []).map(o => o.value);
          if (!options.includes(value)) {
            throwFieldError(sails.config.custom.respCode.INVALID_OPTION, field);
          }
          break;
        }
      }
    }
  },
};
