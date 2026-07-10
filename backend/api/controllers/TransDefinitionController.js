module.exports = {
  detail: async (req, res) => {
    try {
      const { serviceId } = req.body;
      if (!serviceId) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }
      const definition = await TransDefinition.findOne({ serviceId });
      return res.ok({ definition: definition || null });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  create: async (req, res) => {
    try {
      const { serviceId, glSteps } = req.body;
      if (!serviceId || !glSteps) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      const existing = await TransDefinition.findOne({ serviceId });
      if (existing) {
        return res.error(sails.config.custom.respCode.ERR_DUPLICATE);
      }

      const definition = await TransDefinition.create({ serviceId, glSteps }).fetch();
      return res.ok({ definition });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  update: async (req, res) => {
    try {
      const { serviceId, glSteps } = req.body;
      if (!serviceId || !glSteps) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      const existing = await TransDefinition.findOne({ serviceId });
      if (!existing) {
        return res.error(sails.config.custom.respCode.ERR_NOT_FOUND);
      }

      const definition = await TransDefinition.updateOne({ serviceId }).set({ glSteps });
      return res.ok({ definition });
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

      const definition = await TransDefinition.findOne({ serviceId });
      if (!definition) {
        return res.error(sails.config.custom.respCode.ERR_NOT_FOUND);
      }

      await TransDefinition.destroyOne({ serviceId });
      return res.ok({ message: 'Đã xóa definition' });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },
};
