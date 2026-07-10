module.exports = {
  list: async (req, res) => {
    try {
      const { serviceId } = req.body;
      if (!serviceId) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }
      const validations = await TransValidation.find({ serviceId }).sort('order ASC');
      return res.ok({ validations });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  create: async (req, res) => {
    try {
      const { serviceId, order, validatorKey, validateFields, errorCode, errorMessage } = req.body;
      if (!serviceId || !validatorKey || !validateFields || !errorMessage || order === undefined) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      const validation = await TransValidation.create({
        serviceId, order, validatorKey, validateFields,
        errorCode:    errorCode || null,
        errorMessage,
      }).fetch();

      return res.ok({ validation });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  update: async (req, res) => {
    try {
      const { validationId, ...fields } = req.body;
      if (!validationId) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      const validation = await TransValidation.updateOne({ id: validationId }).set(fields);
      if (!validation) {
        return res.error(sails.config.custom.respCode.ERR_NOT_FOUND);
      }

      return res.ok({ validation });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  delete: async (req, res) => {
    try {
      const { validationId } = req.body;
      if (!validationId) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      await TransValidation.destroyOne({ id: validationId });
      return res.ok();
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },
};
