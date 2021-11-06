const koaBody = require('koa-body')
const koaLogger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const BaseFramework = require('@galenjs/framework-next')
const compose = require('koa-compose')
const shortId = require('shortid')

const Schedule = require('@galenjs/schedule')
const createLogger = require('@galenjs/logger')
const als = require('@galenjs/als')

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
  port: 3000,
  loggerConfig: {
    logDir: `${process.cwd()}/logs`
  }
}

class Framework extends BaseFramework {
  async beforeInit() {
    await super.beforeInit()
    this.app.als = als
    this.app.context.logger = createLogger(this.config.loggerConfig, this.app.als)
  }

  async afterInit() {
    this.schedule = new Schedule({
      schedulePath: this.config.schedulePath,
      workspace: process.cwd(),
      plugin: this.config.plugin
    })
    await super.afterInit()
    this.app.use(compose([
      koaLogger(),
      koaBody({}),
      bodyParser()
    ]))
    this.loadMiddleware([
      'requestId', 'errorHandler', 'cors', 'jwtVerify', 'auth', 'router'
    ])
    this.app.use(async (ctx, next) => {
      await als.run({
        requestId: ctx.headers['X-Request-Id'] || shortId.generate(),
        method: ctx.method,
        originalUrl: ctx.originalUrl
      }, async () => {
        await next()
      })
    })
  }

  async beforeClose () {
    this.schedule.softExit()
  }
}

const bootstrap = async () => {
  const framework = new Framework(config)
  await framework.init()
  await framework.start()
}

bootstrap()
