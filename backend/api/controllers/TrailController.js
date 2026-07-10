module.exports = {
  list: async (req, res) => {
    try {
      const { page = 1, limit = 20, status } = req.body;
      const where = status ? { status } : {};
      const skip = (page - 1) * limit;

      const total = await TransactionTrail.count(where);
      const trails = await TransactionTrail.find(where)
        .sort('createdAt DESC')
        .skip(skip)
        .limit(limit);

      const totalPages = Math.ceil(total / limit);

      return res.ok({ trails, page, limit, total, totalPages });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  detail: async (req, res) => {
    try {
      const { trailId, transRefId } = req.body;
      let trail;
      if (trailId) {
        trail = await TransactionTrail.findOne({ id: trailId });
      } else if (transRefId) {
        trail = await TransactionTrail.findOne({ transRefId });
      } else {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }
      if (!trail) {
        return res.error(sails.config.custom.respCode.ERR_NOT_FOUND);
      }
      return res.ok({ trail });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },
};
