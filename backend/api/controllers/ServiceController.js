module.exports = {
  list: async (req, res) => {
    try {
      const { page = 1, limit = 20 } = req.body;
      const skip = (page - 1) * limit;

      const total = await Service.count();
      const services = await Service.find()
        .sort('createdAt DESC')
        .skip(skip)
        .limit(limit);

      const totalPages = Math.ceil(total / limit);

      return res.ok({ services, page, limit, total, totalPages });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  detail: async (req, res) => {
    try {
      const { serviceId } = req.body;
      if (!serviceId) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      const service = await Service.findOne({ id: serviceId });
      if (!service) {
        return res.error(sails.config.custom.respCode.ERR_NOT_FOUND);
      }

      const [fields, validations, definition] = await Promise.all([
        TransField.find({ serviceId }).sort('order ASC'),
        TransValidation.find({ serviceId }).sort('order ASC'),
        TransDefinition.findOne({ serviceId }),
      ]);

      return res.ok({ service, fields, validations, definition });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  create: async (req, res) => {
    try {
      const { code, name, type, action, actionParams, auth, fee, fieldBuilder } = req.body;
      if (!code || !name || !type || !auth || !fee || !fieldBuilder) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      const existing = await Service.findOne({ code });
      if (existing) {
        return res.error(sails.config.custom.respCode.ERR_DUPLICATE);
      }

      const service = await Service.create({
        code: code.toUpperCase(),
        name, type,
        action: action || 'none',
        actionParams: actionParams || {},
        auth, fee, fieldBuilder,
        status: 'active',
      }).fetch();

      return res.ok({ service });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  update: async (req, res) => {
    try {
      const { serviceId, ...fields } = req.body;
      if (!serviceId) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      delete fields.code;
      const service = await Service.updateOne({ id: serviceId }).set(fields);
      if (!service) {
        return res.error(sails.config.custom.respCode.ERR_NOT_FOUND);
      }

      return res.ok({ service });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  delete: async (req, res) => {
    try {
      const { serviceId } = req.body;
      if (!serviceId) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      await Service.destroyOne({ id: serviceId });
      await TransField.destroy({ serviceId });
      await TransValidation.destroy({ serviceId });
      await TransDefinition.destroyOne({ serviceId });

      return res.ok();
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },
};
