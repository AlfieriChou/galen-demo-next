const { generateRSAKeyPair } = require('../../lib/crypto')

module.exports = class Secret {
  async getRSAKeys (clientId, ctx) {
    return ctx.redis.getObject('main', `RSA-keys:${clientId}`)
  }

  async setRSAKeys ({
    clientId, keys, expires = ONE_DAY
  }, ctx) {
    return ctx.redis.setObject('main', `RSA-keys:${clientId}`, keys, expires)
  }

  async getClientId (ctx) {
    const dateStr = format(new Date(), 'yyyyMMdd')
    const seq = await ctx.redis.incr('main', `clientIdSeq:${dateStr}`, 60 * 60 * 24 * 2)
    return `${
      dateStr
    }${
      (`${seq || 0}`).padStart(7, 0)
    }${
      Math.random().toString().slice(-2)
    }`
  }

  async generateRSAPublicKey (ctx) {
    const { clientId, rsaKeys } = await this.generateRSA(ctx)
    return {
      clientId,
      publicKey: rsaKeys.publicKey,
      expiresIn: Date.now() + ONE_DAY
    }
  }
  async generateRSA (ctx) {
    const clientId = await ctx.getClientId(ctx)
    const rsaKeys = await generateRSAKeyPair()
    await this.setRSAKeys({
      clientId, keys: rsaKeys
    }, ctx)
    return {
      clientId, rsaKeys
    }
  }
}