exports.schedule = {
  time: "0 * * * * *",
};

exports.task = (ctx) => {
  ctx.logger.info("Time:", Date.now());
};
