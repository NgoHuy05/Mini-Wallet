// api/services/trail/TrailService.js
const EXPIRED_MINUTES = sails.config.custom.TRAIL_EXPIRED_MINUTES || 5;

module.exports = {
  create: async ({ transRefId, serviceId, triggeredById, inputMessage }) => {
    const expiredAt = new Date(Date.now() + EXPIRED_MINUTES * 60 * 1000);
    return await TransactionTrail.create({
      transRefId,
      serviceId,
      triggeredById,
      status: 'init',
      expiredAt,
      inputMessage,
      outputMessage: {},
      feeSnapshot: {},
      transStepLog: [{
        step: 'START',
        at: new Date().toISOString(),
        result: 'ok',
        detail: 'Transaction initialized',
      }],
    }).fetch();
  },

  updatePending: async (transRefId, { transbody, feeSnapshot, preview }) => {
    const log = { step: 'REQUEST', at: new Date().toISOString(), result: 'ok' };
    return await TransactionTrail.updateOne({ transRefId }).set({
      status: 'pending',
      outputMessage: transbody,
      feeSnapshot,
      preview,
      transStepLog: await module.exports._appendLog(transRefId, log),
    });
  },

  findPending: async (transRefId) => {
    const trail = await TransactionTrail.findOne({ transRefId, status: 'pending' });
    if (!trail) { sails.config.custom.respCode.throw(sails.config.custom.respCode.TRAIL_NOT_FOUND_OR_NOT_PENDING); }
    if (new Date() > new Date(trail.expiredAt)) { sails.config.custom.respCode.throw(sails.config.custom.respCode.TRAIL_EXPIRED); }
    return trail;
  },

  updateConfirmed: async (transRefId) => {
    const log = { step: 'CONFIRM', at: new Date().toISOString(), result: 'ok' };
    return await TransactionTrail.updateOne({ transRefId }).set({
      status: 'confirmed',
      transStepLog: await module.exports._appendLog(transRefId, log),
    });
  },

  findConfirmed: async (transRefId) => {
    const trail = await TransactionTrail.findOne({ transRefId, status: 'confirmed' });
    if (!trail) { sails.config.custom.respCode.throw(sails.config.custom.respCode.TRAIL_NOT_FOUND_OR_NOT_CONFIRMED); }
    if (new Date() > new Date(trail.expiredAt)) { sails.config.custom.respCode.throw(sails.config.custom.respCode.TRAIL_EXPIRED); }
    return trail;
  },

  updateProcessing: async (transRefId) => {
    return await TransactionTrail.updateOne({ transRefId }).set({ status: 'processing' });
  },

  updateDone: async (transRefId) => {
    const log = { step: 'END', at: new Date().toISOString(), result: 'ok' };
    return await TransactionTrail.updateOne({ transRefId }).set({
      status: 'done',
      transStepLog: await module.exports._appendLog(transRefId, log),
    });
  },

  updateFailed: async (transRefId, reason) => {
    const log = { step: 'END', at: new Date().toISOString(), result: 'fail', error: reason };
    return await TransactionTrail.updateOne({ transRefId }).set({
      status: 'failed',
      failureReason: reason,
      transStepLog: await module.exports._appendLog(transRefId, log),
    });
  },

  appendLog: async (transRefId, step, detail = '') => {
    const log = { step, at: new Date().toISOString(), result: 'ok', detail };
    await TransactionTrail.updateOne({ transRefId }).set({
      transStepLog: await module.exports._appendLog(transRefId, log),
    });
  },

  _appendLog: async (transRefId, newLog) => {
    const trail = await TransactionTrail.findOne({ transRefId });
    const current = trail ? (trail.transStepLog || []) : [];
    return [...current, newLog];
  },
};
