// api/services/engine/NeonMessage.js
module.exports = {
  routeProcess: async (transInput) => {
    const { TRANSTEP } = transInput;

    switch (TRANSTEP) {
      case 1: {
        const result = await RequestStep.process(transInput);

        if (result.auth === 'NONE') {
          await ConfirmStep.process({ transRefId: result.transRefId });
          const verifyResult = await module.exports.routeProcess({
            ...transInput,
            TRANSTEP: 3,
            transRefId: result.transRefId,
            pin: null,
          });

          return {
            ...verifyResult,
            transRefId: result.transRefId,
            preview: result.preview,
            auth: 'NONE',
            completed: true,
          };
        }

        return result;
      }

      case 2:
        return await ConfirmStep.process(transInput);

      case 3:
        return await VerifyStep.process(transInput);

      default:
        return { err: 400, message: `TRANSTEP không hợp lệ: ${TRANSTEP}`, data: null };
    }
  },
};
