const ExpireStore = require("expire-store");

const sessionStore = new ExpireStore(60000);

module.exports = () =>
  async (ctx, next) => {
    if (!ctx.headers.sessionid) {
      return next();
    }
    const sessionid = ctx.headers.sessionid;
    let userInfo = sessionStore.get(sessionid);
    if (typeof userInfo === "undefined") {
      try {
        const token = await ctx.redis.get(
          "main",
          `loginSessionId:${sessionid}`,
        );
        if (!token) {
          ctx.throw(403, "login expired");
        }
        const payload = await ctx.service.jwt.verifyToken(token);
        userInfo = {
          phone: payload.phone,
        };
      } catch (err) {
        ctx.throw(403, "invalid token");
      }
      sessionStore.set(sessionid, userInfo);
    }
    ctx.user = userInfo;
    return next();
  };
