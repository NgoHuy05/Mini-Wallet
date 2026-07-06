module.exports = {
  list: async (req, res) => {
    try {
      const { page = 1, limit = 20 } = req.body;
      const skip = (page - 1) * limit;

      const total = await PocketEntry.count();
      const entries = await PocketEntry.find()
        .sort('createdAt DESC')
        .skip(skip)
        .limit(limit);

      const totalPages = Math.ceil(total / limit);

      return res.ok({ entries, page, limit, total, totalPages });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  detail: async (req, res) => {
    try {
      const { entryId } = req.body;
      if (!entryId) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }
      const entry = await PocketEntry.findOne({ id: entryId });
      if (!entry) {
        return res.error(sails.config.custom.respCode.ERR_NOT_FOUND);
      }
      return res.ok({ entry });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  byTrail: async (req, res) => {
    try {
      const { transRefId } = req.body;
      if (!transRefId) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }
      const entries = await PocketEntry.find({ transRefId }).sort('glStepOrder ASC');
      return res.ok({ entries });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  byPocket: async (req, res) => {
    try {
      const { pocketId, page = 1, limit = 20 } = req.body;
      if (!pocketId) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      const where = {
        or: [
          { debitPocketId: pocketId },
          { creditPocketId: pocketId },
        ],
      };
      const skip = (page - 1) * limit;

      const total = await PocketEntry.count(where);
      const entries = await PocketEntry.find(where)
        .sort('createdAt DESC')
        .skip(skip)
        .limit(limit);

      const totalPages = Math.ceil(total / limit);

      return res.ok({ entries, page, limit, total, totalPages });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },
};
