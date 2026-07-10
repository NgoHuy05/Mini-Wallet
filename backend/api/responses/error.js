// api/responses/error.js
module.exports = function error(code, message) {
  if (typeof code === 'object' && code.code) {
    message = message || code.message;
    code = code.code;
  }
  return this.res.status(200).json({
    err: code || 9999,
    message: message || 'Internal error',
    data: null
  });
};
