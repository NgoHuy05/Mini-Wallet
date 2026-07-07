module.exports = {
  calc: (feeConfig, transbody) => {
    const amount = Number(transbody.AMOUNT) || 0;
    let calculatedFee = 0;

    if (feeConfig.type === 'fixed') {
      calculatedFee = Number(feeConfig.value) || 0;
    } else if (feeConfig.type === 'percent') {
      calculatedFee = Math.floor(amount * feeConfig.value / 100);
      if (feeConfig.max && calculatedFee > feeConfig.max) {
        calculatedFee = feeConfig.max;
      }
    }

    transbody.DEBITFEE = calculatedFee;
    transbody.TOTALAMOUNT = amount + calculatedFee;

    const systemPocketId = feeConfig.systemPocketId || sails.config.custom.SYSTEM_FEE_POCKET_ID || null;
    transbody.SYSTEM_POCKET_ID = systemPocketId;

    const feeSnapshot = {
      type: feeConfig.type,
      value: feeConfig.value,
      max: feeConfig.max || null,
      calculatedFee,
      systemPocketId: systemPocketId,
    };

    return feeSnapshot;
  },
};
