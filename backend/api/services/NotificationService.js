const _ = require('lodash');

module.exports = {

  createNotification: async function (opts) {
    const { userId, transactionId, type, amount, transRefId, content } = opts;

    if (!userId) {
      throw new Error('userId is required');
    }

    const formattedAmount = amount.toLocaleString('vi-VN') + ' VND';

    let message = opts.message;
    if (!message) {
      if (type === 'credit') {
        message = `Tài khoản của bạn đã được cộng ${formattedAmount}. Mã GD: ${transRefId}`;
        if (content) {
          message += `. Nội dung: ${content}`;
        }
      } else {
        message = `Tài khoản của bạn đã bị trừ ${formattedAmount}. Mã GD: ${transRefId}`;
        if (content) {
          message += `. Nội dung: ${content}`;
        }
      }
    }

    const notification = await Notification.create({
      userId: userId,
      transactionId: transactionId || null,
      type: type,
      amount: amount,
      transRefId: transRefId,
      content: content || '',
      message: message,
      isRead: false
    }).fetch();

    sails.sockets.broadcast(`user_${userId}`, 'transaction-notification', {
      notification: notification,
      toast: message
    });

    return notification;
  },

  notifyTransaction: async function (transaction) {
    const { id, transRefId, amount, fee, total, senderPocketId, receiverPocketId, triggeredById, message, status } = transaction;

    if (status !== 'done') {
      return;
    }

    const senderPocket = senderPocketId ? await Pocket.findOne({ id: senderPocketId }) : null;
    const receiverPocket = receiverPocketId ? await Pocket.findOne({ id: receiverPocketId }) : null;

    const senderUserId = senderPocket ? senderPocket.ownerId : null;
    const receiverUserId = receiverPocket ? receiverPocket.ownerId : null;

    if (senderUserId) {
      await this.createNotification({
        userId: senderUserId,
        transactionId: id,
        type: 'debit',
        amount: total,
        transRefId: transRefId,
        content: message || 'Giao dịch chuyển tiền'
      });
    }

    if (receiverUserId) {
      if (senderUserId && senderUserId === receiverUserId) {
        return;
      }
      await this.createNotification({
        userId: receiverUserId,
        transactionId: id,
        type: 'credit',
        amount: amount,
        transRefId: transRefId,
        content: message || 'Giao dịch nhận tiền'
      });
    }
  }
};
