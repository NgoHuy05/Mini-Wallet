module.exports = {
  list: async (req, res) => {
    try {
      const { serviceId } = req.body;
      if (!serviceId) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }
      const fields = await TransField.find({ serviceId }).sort('order ASC');
      return res.ok({ fields });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  create: async (req, res) => {
    try {
      const { serviceId, fieldName, label, inputType, order, isRequired, needSecured, rules, errorCode, description } = req.body;
      if (!serviceId || !fieldName || !label || !inputType || order === undefined) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      const field = await TransField.create({
        serviceId, fieldName, label, inputType, order,
        isRequired:  isRequired  !== undefined ? isRequired  : true,
        needSecured: needSecured !== undefined ? needSecured : false,
        rules:       rules || {},
        errorCode:   errorCode || null,
        description: description || null,
      }).fetch();

      return res.ok({ field });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  update: async (req, res) => {
    try {
      const { fieldId, ...fields } = req.body;
      if (!fieldId) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      const field = await TransField.updateOne({ id: fieldId }).set(fields);
      if (!field) {
        return res.error(sails.config.custom.respCode.ERR_NOT_FOUND);
      }

      return res.ok({ field });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  delete: async (req, res) => {
    try {
      const { fieldId } = req.body;
      if (!fieldId) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      await TransField.destroyOne({ id: fieldId });
      return res.ok();
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },
};
