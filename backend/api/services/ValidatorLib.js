// ValidatorLib.js

const VALIDATORS = {

  validateReceiverExists: async (params) => {
    const { RECEIVERID } = params;
    if (!RECEIVERID) { sails.config.custom.respCode.throw(sails.config.custom.respCode.ERR_RECEIVER_NOT_FOUND); }
    const pocket = await Pocket.findOne({ id: RECEIVERID });
    if (!pocket || pocket.status !== 'active') { sails.config.custom.respCode.throw(sails.config.custom.respCode.ERR_RECEIVER_NOT_FOUND); }
  },

  validateReceiverIsNotSender: async (params) => {
    const { SENDERID, RECEIVERID } = params;
    if (SENDERID === RECEIVERID) { sails.config.custom.respCode.throw(sails.config.custom.respCode.ERR_SELF_TRANSFER); }
  },

  validateSenderNotLocked: async (params) => {
    const { SENDERID } = params;
    const pocket = await Pocket.findOne({ id: SENDERID });
    if (!pocket || pocket.status === 'locked') { sails.config.custom.respCode.throw(sails.config.custom.respCode.ERR_SENDER_LOCKED); }
  },

  validateSenderAccountSufficiency: async (params) => {
    const { SENDERID, AMOUNT, DEBITFEE } = params;
    const pocket = await Pocket.findOne({ id: SENDERID });
    if (!pocket) { sails.config.custom.respCode.throw(sails.config.custom.respCode.ERR_SENDER_NOT_FOUND); }
    ChecksumService.verifyOrThrow(pocket);
    const total = Number(AMOUNT) + Number(DEBITFEE || 0);
    if (pocket.balance < total) { sails.config.custom.respCode.throw(sails.config.custom.respCode.ERR_INSUFFICIENT_BALANCE); }
  },

  validateBankSufficiency: async (params) => {
    const { SENDERID, AMOUNT } = params;
    const pocket = await Pocket.findOne({ id: SENDERID });
    if (!pocket) { sails.config.custom.respCode.throw(sails.config.custom.respCode.ERR_BANK_NOT_FOUND); }
    ChecksumService.verifyOrThrow(pocket);
    if (pocket.balance < Number(AMOUNT)) { sails.config.custom.respCode.throw(sails.config.custom.respCode.ERR_BANK_INSUFFICIENT); }
  },

  validateBillerActive: async (params) => {
    const { BILLERID } = params;
    if (!BILLERID) { sails.config.custom.respCode.throw(sails.config.custom.respCode.ERR_BILLER_LOCKED, 'ERR_BILLER_NOT_FOUND'); }
    const biller = await Biller.findOne({ id: BILLERID });
    if (!biller || biller.status !== 'active') { sails.config.custom.respCode.throw(sails.config.custom.respCode.ERR_BILLER_LOCKED); }
  },

  validateBillInquirySuccess: async (params) => {
    const { AMOUNT } = params;
    if (!AMOUNT || Number(AMOUNT) <= 0) { sails.config.custom.respCode.throw(sails.config.custom.respCode.ERR_BILL_NOT_FOUND); }
  },

};

module.exports = {
  run: async (serviceId, transbody) => {
    const validations = await TransValidation.find({ serviceId }).sort('order ASC');
    for (const v of validations) {
      const fn = VALIDATORS[v.validatorKey];
      if (!fn) { sails.config.custom.respCode.throw(sails.config.custom.respCode.INTERNAL_ERROR); }

      const params = {};
      for (const key of v.validateFields.split(':')) {
        params[key.trim()] = transbody[key.trim()];
      }

      try {
        await fn(params);
      } catch (err) {
        if (err.code) { throw err; }
        sails.config.custom.respCode.throw(sails.config.custom.respCode.INTERNAL_ERROR);
      }
    }
  },

  doubleCheck: async (transbody) => {
    await VALIDATORS.validateSenderNotLocked({ SENDERID: transbody.SENDERID });
    await VALIDATORS.validateSenderAccountSufficiency({
      SENDERID: transbody.SENDERID,
      AMOUNT: transbody.AMOUNT,
      DEBITFEE: transbody.DEBITFEE,
    });
  },
};
