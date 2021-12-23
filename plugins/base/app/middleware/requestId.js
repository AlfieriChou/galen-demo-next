const shortId = require('shortid');

module.exports = () =>
  async (ctx, next) => {
    let requestId = shortId.generate();
    if (ctx.get('X-Request-Id')) {
      requestId = ctx.get('X-Request-Id');
    }
    if (ctx.headers['X-Request-Id']) {
      requestId = ctx.headers['X-Request-Id'];
    }
    ctx.state.requestId = requestId;
    await next();
  };
