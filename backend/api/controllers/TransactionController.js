module.exports = {
  request: async (req, res) => {
    try {
      const result = await NeonMessage.routeProcess({
        TRANSTEP: 1,
        serviceId: req.body.serviceId,
        parameters: req.body.parameters,
        userId: req.user.userId,
      });
      return res.ok(result);
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  confirm: async (req, res) => {
    try {
      const result = await NeonMessage.routeProcess({
        TRANSTEP: 2,
        transRefId: req.body.transRefId,
      });
      return res.ok(result);
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  verify: async (req, res) => {
    try {
      const result = await NeonMessage.routeProcess({
        TRANSTEP: 3,
        transRefId: req.body.transRefId,
        pin: req.body.pin,
      });
      return res.ok(result);
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  history: async (req, res) => {
    try {
      const { page = 1, limit = 20 } = req.body;
      const userId = req.user.userId;
      const skip = (page - 1) * limit;
      const where = { triggeredById: userId };

      const total = await Transaction.count(where);
      const transactions = await Transaction.find(where)
        .sort('createdAt DESC')
        .skip(skip)
        .limit(limit);

      const totalPages = Math.ceil(total / limit);
      return res.ok({ transactions, page, limit, total, totalPages });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  detail: async (req, res) => {
    try {
      const { transactionId } = req.body;
      if (!transactionId) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      const transaction = await Transaction.findOne({ id: transactionId });
      if (!transaction) {
        return res.error(sails.config.custom.respCode.ERR_NOT_FOUND);
      }

      if (req.user.userType === 'officer') {
        return res.ok({ transaction });
      }

      const customer = await Customer.findOne({ id: req.user.userId });
      if (!customer) {
        return res.error(sails.config.custom.respCode.ERR_CUSTOMER_NOT_FOUND);
      }
      const myPocketId = customer.pocketId;

      const isInitiator = transaction.triggeredById === req.user.userId;
      const isSender = transaction.senderPocketId === myPocketId;
      const isReceiver = transaction.receiverPocketId === myPocketId;

      if (!isInitiator && !isSender && !isReceiver) {
        return res.error(sails.config.custom.respCode.ERR_FORBIDDEN);
      }

      return res.ok({ transaction });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  allHistory: async (req, res) => {
    try {
      const { page = 1, limit = 20 } = req.body;
      const userId = req.user.userId;
      const skip = (page - 1) * limit;

      const customer = await Customer.findOne({ id: userId });
      if (!customer) {
        return res.error(sails.config.custom.respCode.ERR_CUSTOMER_NOT_FOUND);
      }
      const pocketId = customer.pocketId;

      const where = {
        or: [
          { senderPocketId: pocketId },
          { receiverPocketId: pocketId },
        ]
      };

      const total = await Transaction.count(where);
      const transactions = await Transaction.find(where)
        .sort('createdAt DESC')
        .skip(skip)
        .limit(limit);

      const totalPages = Math.ceil(total / limit);
      return res.ok({ transactions, page, limit, total, totalPages });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  listAdmin: async (req, res) => {
    try {
      const { page = 1, limit = 20, status } = req.body;
      const where = status ? { status } : {};
      const skip = (page - 1) * limit;

      const total = await Transaction.count(where);
      const transactions = await Transaction.find(where)
        .sort('createdAt DESC')
        .skip(skip)
        .limit(limit);

      const totalPages = Math.ceil(total / limit);

      return res.ok({ transactions, page, limit, total, totalPages });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },
};
