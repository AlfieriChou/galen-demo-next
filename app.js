const koaBody = require('koa-body')
const koaLogger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const BaseFramework = require('@galenjs/framework-next')
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
  schedulePath: 'app/schedule',
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

class Framework extends BaseFramework {
  async afterInit() {
    await super.afterInit()
    this.app.use(compose([
      koaLogger(),
      koaBody({}),
      bodyParser()
    ]))
    this.loadMiddleware([
      'errorHandler', 'cors', 'jwtVerify', 'auth', 'router'
    ])
  }
}

const bootstrap = async () => {
  const framework = new Framework(config)
  await framework.init()
  await framework.start()
}

bootstrap()
