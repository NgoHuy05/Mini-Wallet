// ConfirmStep.js

module.exports = {
  process: async (transInput) => {
    const { transRefId } = transInput;
    if (!transRefId) { sails.config.custom.respCode.throw(sails.config.custom.respCode.MISSING_TRANS_REF_ID); }

    const trail = await TrailService.findPending(transRefId);
    const authMethod = trail.outputMessage.AUTH || 'PIN';
    await TrailService.appendLog(transRefId, 'CONFIRM', `Auth method: ${authMethod}`);

    await TrailService.updateConfirmed(transRefId);

    return {
      authMethod,
      transRefId,
    };
  },
};
