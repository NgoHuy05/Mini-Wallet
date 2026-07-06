const bcrypt = require('bcrypt');

module.exports = {
  compare: async (pin, customerId) => {
    const customer = await Customer.findOne({ id: customerId });
    if (!customer) {
      sails.config.custom.respCode.throw(sails.config.custom.respCode.ERR_CUSTOMER_NOT_FOUND);
    }
    if (customer.status === 'locked') {
      sails.config.custom.respCode.throw(sails.config.custom.respCode.ERR_ACCOUNT_LOCKED);
    }

    const match = await bcrypt.compare(String(pin), customer.pinHash);
    if (!match) {
      sails.config.custom.respCode.throw(sails.config.custom.respCode.ERR_WRONG_PIN);
    }
  },
};
