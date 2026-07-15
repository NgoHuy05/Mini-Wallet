// api/controllers/NotificationController.js
module.exports = {

  list: async function (req, res) {
    try {
      const userId = req.user.userId; 
      const { page = 1, limit = 20 } = req.body;
      const skip = (page - 1) * limit;

      const where = { userId };
      const total = await Notification.count(where);
      const notifications = await Notification.find(where)
        .sort('createdAt DESC')
        .skip(skip)
        .limit(limit);

      const totalPages = Math.ceil(total / limit);
      return res.ok({
        data: notifications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages
        }
      });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  markAsRead: async function (req, res) {
    try {
      const userId = req.user.userId;
      const { notificationId } = req.body;
      if (!notificationId) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      const updated = await Notification.updateOne({
        id: notificationId,
        userId: userId
      }).set({ isRead: true });

      if (!updated) {
        return res.error(sails.config.custom.respCode.ERR_NOT_FOUND);
      }
      return res.ok({ message: 'Đã đánh dấu đọc' });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  markAllAsRead: async function (req, res) {
    try {
      const userId = req.user.userId;
      await Notification.update({ userId: userId, isRead: false }).set({ isRead: true });
      return res.ok({ message: 'Đã đánh dấu tất cả là đã đọc' });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  countUnread: async function (req, res) {
    try {
      const userId = req.user.userId;
      const count = await Notification.count({ userId, isRead: false });
      return res.ok({ count });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  }
};
