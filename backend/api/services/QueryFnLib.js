module.exports = {
  queryPocketByCustomerId: async (params) => {
    const customerId = params.userId || params.customerId;
    if (!customerId) { sails.config.custom.respCode.throw(sails.config.custom.respCode.ERR_SENDER_NOT_FOUND); }
    const customer = await Customer.findOne({ id: customerId });
    if (!customer) { sails.config.custom.respCode.throw(sails.config.custom.respCode.ERR_SENDER_NOT_FOUND); }
    const pocket = await Pocket.findOne({ id: customer.pocketId });
    if (!pocket) { sails.config.custom.respCode.throw(sails.config.custom.respCode.ERR_SENDER_NOT_FOUND); }
    return pocket.id;
  },

  queryPocketByPhone: async (params) => {
    const phone = params.receiverPhone || params.customerPhone;
    if (!phone) { return null; }
    const customer = await Customer.findOne({ phone });
    if (!customer) { return null; }
    const pocket = await Pocket.findOne({ id: customer.pocketId });
    return pocket ? pocket.id : null;
  },

  queryBillerByCode: async (params) => {
    const code = params.billerCode || params.BILLERCODE;
    if (!code) { return null; }
    const biller = await Biller.findOne({ code });
    return biller ? biller.id : null;
  },

  queryPocketByBillerId: async (params) => {
    const billerId = params.billerId || params.BILLERID;
    if (!billerId) { return null; }
    const biller = await Biller.findOne({ id: billerId });
    return biller ? biller.pocketId : null;
  },

  queryBillerCodeById: async (params) => {
    const billerId = params.billerId || params.BILLERID;
    if (!billerId) { return null; }
    const biller = await Biller.findOne({ id: billerId });
    return biller ? biller.code : null;
  },

  queryBillerIdByCode: async (params) => {
    const code = params.billerCode || params.BILLERCODE;
    if (!code) { return null; }
    const biller = await Biller.findOne({ code: code.toUpperCase() });
    return biller ? biller.id : null;
  },
};
