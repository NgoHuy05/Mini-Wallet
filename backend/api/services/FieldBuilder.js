// FieldBuilder.js
const _ = require('lodash');

module.exports = {
  build: async (fieldBuilderConfig, transInput) => {
    const transbody = {};
    const parameters = transInput.parameters || {};
    const rules = _.sortBy(fieldBuilderConfig, 'order');

    for (const rule of rules) {
      const varName = rule.variable || rule.name;
      switch (rule.rule) {
        case 'fixed':
          transbody[varName] = rule.source;
          break;

        case 'mapping':
          if (rule.source.startsWith('parameters.')) {
            const key = rule.source.replace('parameters.', '');
            transbody[varName] = parameters[key];
          } else {
            transbody[varName] = _.get(transbody, rule.source);
          }
          break;

        case 'query': {
          const fn = QueryFnLib[rule.query];
          if (!fn) {
            sails.config.custom.respCode.throw(sails.config.custom.respCode.INTERNAL_ERROR);
          }

          const paramKeys = (rule.source || '').split(':').filter(Boolean);
          const params = {};
          for (const key of paramKeys) {
            if (key === 'userId') {
              params[key] = transInput.userId;
            } else {
              params[key] = transbody[key] || parameters[key];
            }
          }
          transbody[varName] = await fn(params);
          break;
        }

        default:
          sails.config.custom.respCode.throw(sails.config.custom.respCode.INTERNAL_ERROR);
      }
    }

    transbody.SERVICEID = transInput.serviceId;
    transbody.USERID = transInput.userId;
    return transbody;
  },
};
