const { nanoid } = require('nanoid');

module.exports = () =>
  async (ctx, next) => {
    let requestId = nanoid(10);
    if (ctx.get('X-Request-Id')) {
      requestId = ctx.get('X-Request-Id');
    }
    if (ctx.headers['X-Request-Id']) {
      requestId = ctx.headers['X-Request-Id'];
    }
    ctx.state.requestId = requestId;
    await next();
  };
