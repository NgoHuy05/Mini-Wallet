module.exports = async (req, res, proceed) => {
  if (!req.user || req.user.userType !== 'customer') {
    return res.error(sails.config.custom.respCode.ERR_AUTH_FAILED, 'Customer access required');
  }
  return proceed();
};
