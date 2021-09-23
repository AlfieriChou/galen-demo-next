const ExpireStore = require('expire-store')

const sessionStore = new ExpireStore(60000)

module.exports = () => async (ctx, next) => {
  if (!ctx.headers.sessionId) {
    return next()
  }
  const sessionId = ctx.headers.sessionId
  let userInfo = sessionStore.get(sessionId)
  if (typeof userInfo === 'undefined') {
    try {
      const token = await ctx.redis.get('main', `loginSessionId:${sessionId}`)
      if (!token) {
        ctx.throw(403, 'login expired')
      }
      const payload = await ctx.service.jwt.verifyToken(token)
      userInfo = {
        phone: payload.phone
      }
    } catch (err) {
      ctx.throw(403, 'invalid token')
    }
    sessionStore.set(sessionId, userInfo)
  }
  ctx.user = userInfo
  return next()
}
