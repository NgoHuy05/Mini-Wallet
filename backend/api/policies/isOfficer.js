module.exports = async (req, res, proceed) => {
  if (!req.user || req.user.userType !== 'officer') {
    return res.error(sails.config.custom.respCode.ERR_AUTH_FAILED, 'Officer access required');
  }
  return proceed();
};
