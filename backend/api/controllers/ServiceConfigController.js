// api/controllers/admin/ServiceConfigController.js
module.exports = {

  getFullConfig: async (req, res) => {
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

      return res.ok({
        service,
        fields,
        validations,
        definition: definition || null,
      });
    } catch (err) {
      sails.log.error('[ServiceConfigController.getFullConfig]', err);
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  createFullConfig: async (req, res) => {
    const { code, name, type, action, actionParams, auth, fee, fieldBuilder, fields, validations, glSteps } = req.body;

    if (!code || !name || !type || !auth || !fee || !fieldBuilder) {
      return res.error(sails.config.custom.respCode.MISSING_FIELD, 'Thiếu thông tin cốt lõi cho Service');
    }
    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      return res.error(sails.config.custom.respCode.MISSING_FIELD, 'fields là bắt buộc');
    }
    if (!validations || !Array.isArray(validations)) {
      return res.error(sails.config.custom.respCode.MISSING_FIELD, 'validations là bắt buộc');
    }
    if (!glSteps || !Array.isArray(glSteps) || glSteps.length === 0) {
      return res.error(sails.config.custom.respCode.MISSING_FIELD, 'glSteps là bắt buộc');
    }

    try {
      const existing = await Service.findOne({ code: code.toUpperCase() });
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

      const promises = [];

      fields.forEach(f => {
        promises.push(TransField.create({
          serviceId: service.id,
          fieldName: f.fieldName, label: f.label, inputType: f.inputType, order: f.order,
          isRequired: f.isRequired !== undefined ? f.isRequired : true,
          needSecured: f.needSecured !== undefined ? f.needSecured : false,
          rules: f.rules || {},
          errorCode: f.errorCode || null,
          description: f.description || null,
        }).fetch());
      });

      validations.forEach(v => {
        promises.push(TransValidation.create({
          serviceId: service.id,
          order: v.order, validatorKey: v.validatorKey, validateFields: v.validateFields,
          errorCode: v.errorCode || null, errorMessage: v.errorMessage,
        }).fetch());
      });

      promises.push(TransDefinition.create({ serviceId: service.id, glSteps }).fetch());

      await Promise.all(promises);

      const [createdFields, createdValidations, createdDefinition] = await Promise.all([
        TransField.find({ serviceId: service.id }).sort('order ASC'),
        TransValidation.find({ serviceId: service.id }).sort('order ASC'),
        TransDefinition.findOne({ serviceId: service.id }),
      ]);

      return res.ok({
        service,
        fields: createdFields,
        validations: createdValidations,
        definition: createdDefinition,
      });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  updateFullConfig: async (req, res) => {
    const { serviceId, code, name, type, action, actionParams, auth, fee, fieldBuilder, fields, validations, glSteps } = req.body;

    if (!serviceId) {
      return res.error(sails.config.custom.respCode.MISSING_FIELD, 'serviceId là bắt buộc');
    }

    try {
      const service = await Service.findOne({ id: serviceId });
      if (!service) {
        return res.error(sails.config.custom.respCode.ERR_NOT_FOUND, 'Không tìm thấy service');
      }

      if (code || name || type || action || actionParams || auth || fee || fieldBuilder) {
        const updateData = {};
        if (code) { updateData.code = code.toUpperCase(); }
        if (name) { updateData.name = name; }
        if (type) { updateData.type = type; }
        if (action) { updateData.action = action; }
        if (actionParams) { updateData.actionParams = actionParams; }
        if (auth) { updateData.auth = auth; }
        if (fee) { updateData.fee = fee; }
        if (fieldBuilder) { updateData.fieldBuilder = fieldBuilder; }
        await Service.updateOne({ id: serviceId }).set(updateData);
      }

      if (fields && Array.isArray(fields)) {
        await TransField.destroy({ serviceId });
        await Promise.all(fields.map(f => TransField.create({
          serviceId,
          fieldName: f.fieldName, label: f.label, inputType: f.inputType, order: f.order,
          isRequired: f.isRequired !== undefined ? f.isRequired : true,
          needSecured: f.needSecured !== undefined ? f.needSecured : false,
          rules: f.rules || {},
          errorCode: f.errorCode || null,
          description: f.description || null,
        }).fetch()));
      }

      if (validations && Array.isArray(validations)) {
        await TransValidation.destroy({ serviceId });
        await Promise.all(validations.map(v => TransValidation.create({
          serviceId,
          order: v.order, validatorKey: v.validatorKey, validateFields: v.validateFields,
          errorCode: v.errorCode || null, errorMessage: v.errorMessage,
        }).fetch()));
      }

      if (glSteps && Array.isArray(glSteps)) {
        const def = await TransDefinition.findOne({ serviceId });
        if (def) {
          await TransDefinition.updateOne({ serviceId }).set({ glSteps });
        } else {
          await TransDefinition.create({ serviceId, glSteps }).fetch();
        }
      }

      const [updatedService, updatedFields, updatedValidations, updatedDefinition] = await Promise.all([
        Service.findOne({ id: serviceId }),
        TransField.find({ serviceId }).sort('order ASC'),
        TransValidation.find({ serviceId }).sort('order ASC'),
        TransDefinition.findOne({ serviceId }),
      ]);

      return res.ok({
        service: updatedService,
        fields: updatedFields,
        validations: updatedValidations,
        definition: updatedDefinition || null,
      });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  deleteFullConfig: async (req, res) => {
    try {
      const { serviceId } = req.body;
      if (!serviceId) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      await Service.destroyOne({ id: serviceId });
      await TransField.destroy({ serviceId });
      await TransValidation.destroy({ serviceId });
      await TransDefinition.destroyOne({ serviceId });

      return res.ok({ message: 'Đã xóa toàn bộ service và cấu hình' });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },
};
