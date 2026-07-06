// BillerService.js
const axios = require('axios');
const TIMEOUT_MS = parseInt(sails.config.custom.BILLER_TIMEOUT_MS || '10000');

module.exports = {
  inquiry: async (inquiryUrl, billCode, transRefId) => {
    try {
      const response = await axios.post(
        inquiryUrl,
        { billCode, transRefId },
        { timeout: TIMEOUT_MS }
      );

      const data = response.data;

      if (!data || data.err !== 200) {
        sails.config.custom.respCode.throw(sails.config.custom.respCode.INQUIRY_FAILED);
      }
      if (!data.data || !data.data.amount || Number(data.data.amount) <= 0) {
        sails.config.custom.respCode.throw(sails.config.custom.respCode.ERR_BILL_NOT_FOUND);
      }

      return Number(data.data.amount);
    } catch (err) {
      if (err.code) { throw err; }
      if (err.response) {
        sails.config.custom.respCode.throw(sails.config.custom.respCode.INQUIRY_FAILED);
      }
      sails.config.custom.respCode.throw(sails.config.custom.respCode.INQUIRY_FAILED);
    }
  },

  payment: async (paymentUrl, transbody, transRefId) => {
    try {
      const response = await axios.post(
        paymentUrl,
        {
          billCode: transbody.BILLCODE,
          amount: transbody.AMOUNT,
          transRefId,
        },
        { timeout: TIMEOUT_MS }
      );

      const data = response.data;

      if (!data || data.err !== 200) {
        sails.config.custom.respCode.throw(sails.config.custom.respCode.PAYMENT_FAILED);
      }
      if (!data.data || !data.data.billerRefId) {
        sails.config.custom.respCode.throw(sails.config.custom.respCode.PAYMENT_FAILED);
      }

      return data.data.billerRefId;
    } catch (err) {
      if (err.code) { throw err; }
      if (err.response) {
        sails.config.custom.respCode.throw(sails.config.custom.respCode.PAYMENT_FAILED);
      }
      sails.config.custom.respCode.throw(sails.config.custom.respCode.PAYMENT_FAILED);
    }
  },

};
