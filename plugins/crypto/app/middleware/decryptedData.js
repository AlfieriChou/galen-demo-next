const { decryptedData } = require('../../lib/crypto')

module.exports = () => async (ctx, next) => {
  const { secretType } = ctx.remoteMethod
  // TODO: 支持双向加密
  if (secretType && secretType === 'client') {
    ctx.assert(ctx.request.body.clientId)
    ctx.assert(ctx.request.body.iv)
    ctx.assert(ctx.request.body.encryptedKey)
    ctx.assert(ctx.request.body.encryptedData)
    const {
      iv, encryptedKey, encryptedData, clientId
    } = ctx.request.body
    const rsaKeys = await ctx.service.crypto.getRSAKeys(clientId, ctx)
    if (!rsaKeys || !rsaKeys.privateKey) {
      ctx.throw(403, 'LOAD_PRIVATE_KEY_ERROR')
    }
    try {
      const data = decryptedData(encryptedData, {
        privateKey: rsaKeys.privateKey, encryptedKey, iv
      })
      ctx.request.body = data
    } catch (err) {
      ctx.logger.error('decrypted.error', err)
      ctx.throw(403, 'DECRYPTED_DATA_ERROR')
    }
  }
  return next()
}
