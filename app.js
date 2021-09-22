const koaBody = require('koa-body')
const koaLogger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const Framework = require('@galenjs/framework-next')
const compose = require('koa-compose')

const config = {
  models: {
    main: {
      dataSource: 'sequelize',
      options: {
        host: '127.0.0.1',
        user: 'root',
        password: 'alfieri',
        database: 'test'
      }
    },
    virtual: {
      dataSource: 'virtual',
      options: {}
    }
  },
  plugin: {
    mainPath: 'plugins',
    plugins: ['doc']
  },
  port: 3000
}

const bootstrap = async () => {
  const framework = new Framework(config)
  await framework.init()
  framework.app.use(compose([
    koaLogger(),
    koaBody({}),
    bodyParser()
  ]))
  await framework.loadMiddleware()
  await framework.start()
}

bootstrap()
