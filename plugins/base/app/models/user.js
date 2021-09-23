const shortId = require('shortid')

module.exports = Model => {
  return class extends Model {
    static async register (ctx) {
      const { request: { body: { phone, password } } } = ctx
      const user = await this.findOne({ where: { phone } })
      if (user) {
        ctx.throw(400, 'user is registered')
      }
      const data  = await this.create({
        phone,
        password: await ctx.service.bcrypt.generateHash(password)
      })
      return this.$formatJson(data.dataValues)
    }
  
    static async login (ctx) {
      const { request: { body: { phone, password } } } = ctx
      const user = await this.findOne({ where: { phone } })
      if (!user) {
        ctx.throw(400, 'user not registered')
      }
      if (!ctx.service.bcrypt.verifyPassword(user.password, password)) {
        ctx.throw(400, 'password error')
      }
      const token = await ctx.service.jwt.createToken({ phone })
      const sessionId = shortId.generate()
      await ctx.redis.set('main', `loginSessionId:${sessionId}`, token, 23 * 60 * 60)
      // set token to cookie and redirect to home page
      return {
        user: this.$formatJson(user.dataValues),
        sessionId
      }
    }
  }  
}