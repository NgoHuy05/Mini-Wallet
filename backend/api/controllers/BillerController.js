module.exports = {
  list: async (req, res) => {
    try {
      const { page = 1, limit = 20 } = req.body;
      const skip = (page - 1) * limit;

      const total = await Biller.count();
      const billers = await Biller.find()
        .sort('createdAt DESC')
        .skip(skip)
        .limit(limit);

      const totalPages = Math.ceil(total / limit);

      return res.ok({ billers, page, limit, total, totalPages });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  detail: async (req, res) => {
    try {
      const { billerId } = req.body;
      if (!billerId) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      const biller = await Biller.findOne({ id: billerId });
      if (!biller) {
        return res.error(sails.config.custom.respCode.ERR_NOT_FOUND);
      }

      const pocket = await Pocket.findOne({ id: biller.pocketId });
      return res.ok({ biller, pocket });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  create: async (req, res) => {
    try {
      const { code, name, inquiryUrl, paymentUrl } = req.body;
      if (!code || !name || !inquiryUrl || !paymentUrl) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      const existing = await Biller.findOne({ code: code.toUpperCase() });
      if (existing) {
        return res.error(sails.config.custom.respCode.ERR_DUPLICATE);
      }

      const pocket = await Pocket.create({
        type: 'biller',
        ownerId: null,
        label: `Ví ${name}`,
        currencyCode: 'VND',
        balance: 0,
        checksum: 'pending',
        status: 'active',
      }).fetch();

      const checksum = ChecksumService.calc(pocket.id, 0);
      await Pocket.updateOne({ id: pocket.id }).set({ checksum });

      const biller = await Biller.create({
        code: code.toUpperCase(),
        name, inquiryUrl, paymentUrl,
        pocketId: pocket.id,
        status: 'active',
      }).fetch();

      await Pocket.updateOne({ id: pocket.id }).set({ ownerId: biller.id });

      return res.ok({ biller, pocket });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  update: async (req, res) => {
    try {
      const { billerId, ...fields } = req.body;
      if (!billerId) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      delete fields.code;
      delete fields.pocketId;

      const biller = await Biller.updateOne({ id: billerId }).set(fields);
      if (!biller) {
        return res.error(sails.config.custom.respCode.ERR_NOT_FOUND);
      }

      return res.ok({ biller });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },
};
