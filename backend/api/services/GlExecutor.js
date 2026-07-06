// api/services/GlExecutor.js
const _ = require('lodash');

module.exports = {
  execute: async (serviceId, transbody, transRefId, triggeredById) => {
    const definition = await TransDefinition.findOne({ serviceId });
    if (!definition) {
      sails.config.custom.respCode.throw(sails.config.custom.respCode.INTERNAL_ERROR, 'TRANS_DEFINITION_NOT_FOUND');
    }

    const glSteps = _.sortBy(definition.glSteps, 'order');
    const manager = sails.getDatastore().manager;
    const session = manager.client.startSession();

    const glStepLogs = [];

    try {
      await session.withTransaction(async () => {
        for (const step of glSteps) {
          const amount = Number(transbody[step.amount]) || 0;
          if (amount === 0) { continue; }

          const debitPocketId  = module.exports._resolvePocket(step.debit, transbody);
          const creditPocketId = module.exports._resolvePocket(step.credit, transbody);

          const debitPocket  = await Pocket.findOne({ id: debitPocketId  }).meta({ session });
          const creditPocket = await Pocket.findOne({ id: creditPocketId }).meta({ session });

          if (!debitPocket || !creditPocket) {
            sails.config.custom.respCode.throw(sails.config.custom.respCode.ERR_NOT_FOUND,);
          }

          ChecksumService.verifyOrThrow(debitPocket);
          ChecksumService.verifyOrThrow(creditPocket);

          const newDebitBalance  = debitPocket.balance  - amount;
          const newCreditBalance = creditPocket.balance + amount;

          if (newDebitBalance < 0) {
            sails.config.custom.respCode.throw(sails.config.custom.respCode.ERR_INSUFFICIENT_BALANCE);
          }

          await Pocket.updateOne({ id: debitPocketId }).set({
            balance:  newDebitBalance,
            checksum: ChecksumService.calc(debitPocketId, newDebitBalance),
          }).meta({ session });

          await Pocket.updateOne({ id: creditPocketId }).set({
            balance:  newCreditBalance,
            checksum: ChecksumService.calc(creditPocketId, newCreditBalance),
          }).meta({ session });

          await PocketEntry.create({
            transRefId,
            glStepOrder:   step.order,
            debitPocketId,
            creditPocketId,
            amount,
            currencyCode:  transbody.CURRENCY || 'VND',
            status:        'settled',
          }).meta({ session });

          // THAY ĐỔI: Ghi nhận thông tin để log sau
          glStepLogs.push(`GL step ${step.order}: debit ${debitPocketId} ${amount}, credit ${creditPocketId} ${amount}`);
        }

        await Transaction.create({
          transRefId,
          serviceId,
          transactionType:  transbody.TRANSACTION_TYPE || 'p2p',
          message:          transbody.MESSAGE || '',
          amount:           Number(transbody.AMOUNT),
          fee:              Number(transbody.DEBITFEE   || 0),
          total:            Number(transbody.TOTALAMOUNT),
          currencyCode:     transbody.CURRENCY || 'VND',
          senderPocketId:   transbody.SENDERID,
          receiverPocketId: transbody.RECEIVERID         || null,
          billerPocketId:   transbody.BILLER_POCKET_ID   || null,
          systemPocketId:   transbody.SYSTEM_POCKET_ID   || null,
          billerCode:       transbody.BILLERCODE         || null,
          billCode:         transbody.BILLCODE           || null,
          billerRefId:      null,
          triggeredById,
          status:           'processing',
        }).meta({ session });

        await TransactionTrail.updateOne({ transRefId }).set({ status: 'processing' }).meta({ session });
      }, {
        readConcern:  { level: 'snapshot' },
        writeConcern: { w: 'majority' },
      });

      glStepLogs.push('Transaction record created');
      await TrailService.appendLog(transRefId, 'VERIFY', glStepLogs.join(' | '));
    } finally {
      await session.endSession();
    }
  },

  reverse: async (serviceId, transbody, transRefId) => {
    const definition = await TransDefinition.findOne({ serviceId });
    if (!definition) {
      sails.config.custom.respCode.throw(sails.config.custom.respCode.INTERNAL_ERROR);
    }

    const glSteps = _.sortBy(definition.glSteps, 'order').reverse();
    const manager = sails.getDatastore().manager;
    const session = manager.client.startSession();

    try {
      await session.withTransaction(async () => {
        for (const step of glSteps) {
          const amount = Number(transbody[step.amount]) || 0;
          if (amount === 0) { continue; }

          const debitPocketId  = module.exports._resolvePocket(step.credit, transbody);
          const creditPocketId = module.exports._resolvePocket(step.debit,  transbody);

          const debitPocket  = await Pocket.findOne({ id: debitPocketId  }).meta({ session });
          const creditPocket = await Pocket.findOne({ id: creditPocketId }).meta({ session });

          if (!debitPocket || !creditPocket) {
            sails.config.custom.respCode.throw(sails.config.custom.respCode.ERR_NOT_FOUND);
          }

          const newDebitBalance  = debitPocket.balance  - amount;
          const newCreditBalance = creditPocket.balance + amount;

          await Pocket.updateOne({ id: debitPocketId }).set({
            balance:  newDebitBalance,
            checksum: ChecksumService.calc(debitPocketId, newDebitBalance),
          }).meta({ session });

          await Pocket.updateOne({ id: creditPocketId }).set({
            balance:  newCreditBalance,
            checksum: ChecksumService.calc(creditPocketId, newCreditBalance),
          }).meta({ session });

          await PocketEntry.updateOne({
            transRefId,
            glStepOrder: step.order,
          }).set({ status: 'reversed' }).meta({ session });
        }

        await Transaction.updateOne({ transRefId }).set({ status: 'reversed' }).meta({ session });
      }, {
        readConcern:  { level: 'snapshot' },
        writeConcern: { w: 'majority' },
      });
    } finally {
      await session.endSession();
    }
  },

  _resolvePocket: (side, transbody) => {
    if (side.level === 'productLevel') {
      return transbody[side.target];
    }
    if (side.level === 'pocket') {
      return side.target;
    }
    sails.config.custom.respCode.throw(sails.config.custom.respCode.INTERNAL_ERROR);
  },
};
