exports.schedule = {
  time: '0 * * * * *'
}

exports.task = () => {
  console.log('Time:', Date.now())
}
