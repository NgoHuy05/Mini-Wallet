module.exports.security = {
  cors: {
    allRoutes: true,
    allowOrigins: ['http://localhost:5173'], // cho phép origin của React app
    allowCredentials: false,
    allowRequestMethods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowRequestHeaders: 'Content-Type,Authorization',
  },
};
