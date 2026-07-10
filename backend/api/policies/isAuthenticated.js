const jwt = require('jsonwebtoken');

module.exports = async function (req, res, proceed) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.error(sails.config.custom.respCode.ERR_AUTH_FAILED, 'Missing or invalid token');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, sails.config.custom.ACCESS_TOKEN_SECRET);

    req.user = decoded;

    return proceed();
  } catch (err) {
    sails.log.error('[isAuthenticated]', err);
    return res.error(sails.config.custom.respCode.ERR_AUTH_FAILED, 'Token verification failed');
  }
};
