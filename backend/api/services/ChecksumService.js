// ChecksumService.js — không cần 'use strict'
const crypto = require('crypto');

module.exports = {
  calc(pocketId, balance) {
    return crypto
      .createHmac('sha256', sails.config.custom.POCKET_SECRET)
      .update(`${pocketId}${balance}`)
      .digest('hex');
  },
  verify(pocket) {
    return this.calc(pocket.id, pocket.balance) === pocket.checksum;
  },
  verifyOrThrow(pocket) {
    if (!this.verify(pocket)) {
      sails.config.custom.respCode.throw(sails.config.custom.respCode.INTERNAL_ERROR);
    }
  },
};
