module.exports = {
  list: async (req, res) => {
    try {
      const { phone, page = 1, limit = 20 } = req.body;
      const where = phone ? { phone: { contains: phone } } : {};
      const skip = (page - 1) * limit;

      const total = await Customer.count(where);
      const customers = await Customer.find(where)
        .sort('createdAt DESC')
        .skip(skip)
        .limit(limit);

      const totalPages = Math.ceil(total / limit);

      return res.ok({ customers, page, limit, total, totalPages });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  detail: async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      const customer = await Customer.findOne({ id: userId });
      if (!customer) {
        return res.error(sails.config.custom.respCode.ERR_NOT_FOUND);
      }

      const pocket = await Pocket.findOne({ id: customer.pocketId });
      ChecksumService.verifyOrThrow(pocket);

      return res.ok({ customer, pocket });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  lock: async (req, res) => {
    try {
      const { userId, reason } = req.body;
      if (!userId || !reason) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      const customer = await Customer.updateOne({ id: userId }).set({
        status: 'locked',
        lockedAt: new Date(),
        lockedReason: reason,
      });
      if (!customer) {
        return res.error(sails.config.custom.respCode.ERR_NOT_FOUND);
      }

      await Pocket.updateOne({ id: customer.pocketId }).set({ status: 'locked' });
      return res.ok({ customer });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  unlock: async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      const customer = await Customer.updateOne({ id: userId }).set({
        status: 'active',
        lockedAt: null,
        lockedReason: null,
      });
      if (!customer) {
        return res.error(sails.config.custom.respCode.ERR_NOT_FOUND);
      }

      await Pocket.updateOne({ id: customer.pocketId }).set({ status: 'active' });
      return res.ok({ customer });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },
};
