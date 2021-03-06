const bcrypt = require('bcryptjs');

const RECOMMENDED_ROUNDS = 12;

const isBcryptHash = str => {
  const protocol = str.split('$');
  return protocol.length === 4
    && protocol[0] === ''
    && ['2a', '2b', '2y'].indexOf(protocol[1]) > -1
    && /^\d+$/.test(protocol[2])
    && protocol[3].length === 53;
};

module.exports = class Bcrypt {
  verifyPassword(hash, password) {
    return bcrypt.compareSync(password, hash);
  }

  async generateHash(password = '') {
    if (isBcryptHash(password)) {
      throw new Error('bcrypt tried to hash another bcrypt hash');
    }
    const salt = bcrypt.genSaltSync(RECOMMENDED_ROUNDS);
    return bcrypt.hashSync(password, salt);
  }
};
