const koaBody = require('koa-body')
const bodyParser = require('koa-bodyparser')
const BaseFramework = require('@galenjs/framework-next')
const compose = require('koa-compose')
const path = require('path')

const Schedule = require('@galenjs/schedule')

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
  plugins: ['doc', 'base'].reduce(
    (ret, item) => ([...ret, { path: path.join(process.cwd(), `plugins/${item}`), name: item }]), []
  ),
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
  loggerOptions: {
    logDir: `${process.cwd()}/logs`
  }
}

class Framework extends BaseFramework {
  async afterInit() {
    this.schedule = new Schedule({
      schedulePath: this.config.schedulePath,
      workspace: process.cwd(),
      plugins: this.config.plugins,
      app: this.app
    })
    await this.schedule.init(this.app.context)
    await super.afterInit()
    this.app.use(compose([
      koaBody({}),
      bodyParser()
    ]))
    this.loadMiddleware([
      'requestId', 'requestLog', 'errorHandler', 'cors', 'jwtVerify', 'auth', 'router'
    ])
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
