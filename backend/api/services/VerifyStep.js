// api/services/engine/VerifyStep.js

module.exports = {
  process: async (transInput) => {
    const { transRefId, pin } = transInput;

    if (!transRefId) {
      sails.config.custom.respCode.throw(sails.config.custom.respCode.MISSING_TRANS_REF_ID);
    }

    const trail = await TrailService.findConfirmed(transRefId);
    const transbody = trail.outputMessage;
    const serviceId = trail.serviceId;
    const authMethod = transbody.AUTH || 'PIN';
    const service = await Service.findOne({ id: serviceId });
    if (!service) {
      sails.config.custom.respCode.throw(sails.config.custom.respCode.SERVICE_NOT_FOUND_OR_INACTIVE);
    }

    await Pocket.updateOne({ id: transbody.SENDERID }).set({
      isLocked: true,
      lockedByTransRefId: transRefId,
    });

    const preGlLogs = [];
    preGlLogs.push(`Locked sender pocket ${transbody.SENDERID}`);

    try {
      if (authMethod === 'PIN') {
        if (!pin) {
          sails.config.custom.respCode.throw(sails.config.custom.respCode.ERR_PIN_REQUIRED);
        }
        await PinService.compare(pin, trail.triggeredById);
        preGlLogs.push('PIN verified');
      }

      await ValidatorLib.doubleCheck(transbody);
      preGlLogs.push('Double check passed');

      await TrailService.appendLog(transRefId, 'VERIFY', preGlLogs.join(' | '));

      await GlExecutor.execute(serviceId, transbody, transRefId, trail.triggeredById);

      if (service.action === 'billerTrans') {
        const billerId = transbody.BILLERID;
        if (!billerId) {
          sails.config.custom.respCode.throw(sails.config.custom.respCode.BILLER_NOT_FOUND);
        }
        const biller = await Biller.findOne({ id: billerId });
        if (!biller) {
          sails.config.custom.respCode.throw(sails.config.custom.respCode.BILLER_NOT_FOUND);
        }
        try {
          const billerRefId = await BillerService.payment(
            biller.paymentUrl,
            transbody,
            transRefId
          );
          await Transaction.updateOne({ transRefId }).set({ billerRefId, status: 'done' });
          await TrailService.appendLog(transRefId, 'VERIFY', `Payment success, billerRefId=${billerRefId}`);
          await TrailService.updateDone(transRefId);
          
        } catch (paymentErr) {
          await GlExecutor.reverse(serviceId, transbody, transRefId);
          await Transaction.updateOne({ transRefId }).set({ status: 'reversed' });
          await TrailService.updateFailed(transRefId, paymentErr.message);
          throw paymentErr;
        }
      } else {
        await Transaction.updateOne({ transRefId }).set({ status: 'done' });
        await TrailService.updateDone(transRefId);
      }

      const transaction = await Transaction.findOne({ transRefId });
      await sails.services.notificationservice.notifyTransaction(transaction);

      return { transaction };
    } catch (err) {
      const currentTrail = await TransactionTrail.findOne({ transRefId });
      if (currentTrail && ['confirmed', 'processing'].includes(currentTrail.status)) {
        if (currentTrail.status !== 'failed') {
          await TrailService.updateFailed(transRefId, err.message);
        }
      }
      throw err;
    } finally {
      await Pocket.updateOne({ id: transbody.SENDERID }).set({
        isLocked: false,
        lockedByTransRefId: null,
      });
      await TrailService.appendLog(transRefId, 'VERIFY', `Unlocked sender pocket ${transbody.SENDERID}`);
    }
  },
};
