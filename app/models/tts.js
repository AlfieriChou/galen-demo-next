const got = require('got');
const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

const options = {
  lan: 'zh',
  ie: 'UTF-8',
  spd: 5,
};

module.exports = Model => {
  return class extends Model {
    static async remoteCreate(ctx) {
      const { text } = ctx.request.body;
      const ret = await got('https://tts.baidu.com/text2audio', {
        responseType: 'buffer',
        searchParams: {
          ...options,
          text,
        },
      });
      let filepath = ctx.request.body.filepath;
      if (!filepath) {
        filepath = path.join(process.cwd(), `tts/${nanoid(10)}.mp3`);
      }
      fs.writeFileSync(filepath, ret.body, 'binary');
      // TODO: return duration
      return { filepath };
    }
  };
};
