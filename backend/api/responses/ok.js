// api/responses/ok.js
module.exports = function ok(data) {
  return this.res.status(200).json({
    err: sails.config.custom.respCode.SUCCESS.code,
    message: sails.config.custom.respCode.SUCCESS.message,
    data: data || null
  });
};
