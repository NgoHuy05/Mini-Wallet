const { v4: uuidv4 } = require('uuid');

module.exports = {
  process: async (transInput) => {
    const { serviceId, userId, parameters } = transInput;

    const transRefId = uuidv4();
    await TrailService.create({
      transRefId,
      serviceId,
      triggeredById: userId,
      inputMessage: parameters,
    });

    try {
      const service = await Service.findOne({ id: serviceId, status: 'active' });
      if (!service) {
        await TrailService.updateFailed(transRefId, 'Service not found or inactive');
        sails.config.custom.respCode.throw(sails.config.custom.respCode.SERVICE_NOT_FOUND_OR_INACTIVE);
      }

      const transbody = await FieldBuilder.build(service.fieldBuilder, transInput);
      transbody.TRANSACTION_TYPE = service.type;
      transbody.MESSAGE = parameters.message || '';

      const requestDetails = [];
      requestDetails.push('TRANSBODY built');

      await FieldValidator.validate(serviceId, transbody);
      requestDetails.push('Field validation passed');

      if (service.action === 'billerTrans') {
        const billerId = transbody.BILLERID;
        if (!billerId) {
          await TrailService.updateFailed(transRefId, 'BILLER_ID_MISSING');
          sails.config.custom.respCode.throw(sails.config.custom.respCode.BILLER_NOT_FOUND);
        }

        const biller = await Biller.findOne({ id: billerId, status: 'active' });
        if (!biller) {
          await TrailService.updateFailed(transRefId, 'BILLER_NOT_FOUND');
          sails.config.custom.respCode.throw(sails.config.custom.respCode.BILLER_NOT_FOUND);
        }

        transbody.BILLERCODE = biller.code;

        try {
          const amount = await BillerService.inquiry(
            biller.inquiryUrl,
            transbody.BILLCODE,
            transRefId
          );
          transbody.AMOUNT = amount;
          requestDetails.push(`Inquiry success, amount=${amount}`);
        } catch (err) {
          await TrailService.updateFailed(transRefId, err.message);
          throw err;
        }
      }

      const feeSnapshot = FeeCalculator.calc(service.fee, transbody);
      requestDetails.push(`Fee calculated: ${transbody.DEBITFEE}`);

      try {
        await ValidatorLib.run(serviceId, transbody);
        requestDetails.push('Business validation passed');
      } catch (err) {
        await TrailService.updateFailed(transRefId, err.message);
        throw err;
      }

      transbody.AUTH = service.auth;
      const preview = {
        amount:      transbody.AMOUNT,
        fee:         transbody.DEBITFEE,
        total:       transbody.TOTALAMOUNT,
        currency:    transbody.CURRENCY || 'VND',
        transRefId,
      };

      await TrailService.appendLog(transRefId, 'REQUEST', requestDetails.join(' | '));
      await TrailService.updatePending(transRefId, { transbody, feeSnapshot, preview });

      return {
        transRefId,
        preview,
        auth: service.auth,
      };
    } catch (err) {
      const trail = await TransactionTrail.findOne({ transRefId });
      if (trail && trail.status === 'init') {
        await TrailService.updateFailed(transRefId, err.message || 'Internal error');
      }
      throw err;
    }
  },
};
