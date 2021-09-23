module.exports = Model => {
  return class extends Model {
    static async register (ctx) {
      const { request: { body: { phone, password } } } = ctx
      const user = await this.findOne({ where: { phone } })
      if (user) {
        ctx.throw(400, 'user is registered')
      }
      return this.create({
        phone,
        password: await ctx.service.bcrypt.generateHash(password)
      })
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
      // set token to cookie and redirect to home page
      return {
        user,
        token: ctx.service.jwt.createToken({ phone })
      }
    }
  }  
}