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
  middlewarePath: 'app/middleware',
  servicePath: 'app/service',
  plugin: {
    mainPath: 'plugins',
    plugins: ['doc', 'base']
  },
  redis: {
    default: {
      host: '127.0.0.1',
      port: 6379,
      password: '',
      db: 2
    },
    clients: {
      main: {
        keyPrefix: 'main'
      }
    }
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
  await framework.loadMiddleware([
    'errorHandler', 'cors', 'jwtVerify', 'auth', 'router'
  ])
  await framework.start()
}

bootstrap()
