const crypto = require('crypto')
const { decrypted } = require('@galenjs/factories/crypto')
const util = require('util')

const generateKeyPair = util.promisify(crypto.generateKeyPair)

const generateRSAKeyPair = async () => {
  const { publicKey, privateKey } = await generateKeyPair('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: ''
    }
  })
  return {
    publicKey: Buffer.from(publicKey).toString('base64'),
    privateKey: Buffer.from(privateKey).toString('base64')
  }
}

const decryptedData = (encryptedData, options) => {
  const { privateKey, encryptedKey, iv } = options
  const key = crypto.privateDecrypt({
    key: Buffer.from(privateKey, 'base64'),
    passphrase: ''
  }, Buffer.from(encryptedKey, 'base64'))
  return JSON.parse(decrypted(encryptedData, { key, iv }))
}

module.exports = {
  generateRSAKeyPair,
  decryptedData
}
