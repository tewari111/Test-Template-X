const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://65.1.132.241:8000',
      changeOrigin: true,
    })
  );
};