module.exports = {
  balance: async (req, res) => {
    try {
      const customer = await Customer.findOne({ id: req.user.userId });
      if (!customer) {
        return res.error(sails.config.custom.respCode.ERR_NOT_FOUND);
      }

      const pocket = await Pocket.findOne({ id: customer.pocketId });
      if (!pocket) {
        return res.error(sails.config.custom.respCode.ERR_NOT_FOUND);
      }

      ChecksumService.verifyOrThrow(pocket);

      return res.ok({
        pocketId: pocket.id,
        balance: pocket.balance,
        currencyCode: pocket.currencyCode,
        label: pocket.label,
        status: pocket.status,
      });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },
  createPocketSystem: async (req, res) => {
    try {
      const { type, label, balance, currencyCode } = req.body;

      if (!type || !label) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      const validTypes = ['system', 'bank', 'biller'];
      if (!validTypes.includes(type)) {
        return res.error(sails.config.custom.respCode.INVALID_OPTION);
      }

      const pocket = await Pocket.create({
        type,
        label,
        currencyCode: currencyCode || 'VND',
        balance: Number(balance) || 0,
        checksum: 'pending',
        status: 'active',
      }).fetch();

      const checksum = sails.services.checksumservice.calc(pocket.id, pocket.balance);
      await Pocket.updateOne({ id: pocket.id }).set({ checksum });

      return res.ok({ pocket });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },
  listPocketsAdmin: async (req, res) => {
    try {
      const { type, page = 1, limit = 20 } = req.body;
      const where = type && type !== 'all' ? { type } : {};
      const skip = (page - 1) * limit;

      const total = await Pocket.count(where);
      const pockets = await Pocket.find(where)
        .sort('createdAt DESC')
        .skip(skip)
        .limit(limit);

      const totalPages = Math.ceil(total / limit);

      return res.ok({ pockets, page, limit, total, totalPages });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },
  detailPocketAdmin: async (req, res) => {
    try {
      const { pocketId } = req.body;
      if (!pocketId) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      const pocket = await Pocket.findOne({ id: pocketId });
      if (!pocket) {
        return res.error(sails.config.custom.respCode.ERR_NOT_FOUND);
      }

      ChecksumService.verifyOrThrow(pocket);

      return res.ok({ pocket });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  manualAdjustAdmin: async (req, res) => {
    try {
      const { pocketId, action, amount, reason } = req.body;
      if (!pocketId || !action || !amount || !reason) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      const pocket = await Pocket.findOne({ id: pocketId });
      if (!pocket) {
        return res.error(sails.config.custom.respCode.ERR_NOT_FOUND);
      }

      const numAmount = Number(amount);
      let newBalance = pocket.balance;

      if (action === 'plus') {
        newBalance += numAmount;
      } else if (action === 'minus') {
        if (pocket.balance < numAmount) {
          return res.error(sails.config.custom.respCode.INVALID_OPTION);
        }
        newBalance -= numAmount;
      } else {
        return res.error(sails.config.custom.respCode.INVALID_OPTION);
      }

      const newChecksum = sails.services.checksumservice.calc(pocket.id, newBalance);

      const updatedPocket = await Pocket.updateOne({ id: pocketId }).set({
        balance: newBalance,
        checksum: newChecksum
      });

      return res.ok({ pocket: updatedPocket });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  }
};
