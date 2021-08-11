const Koa = require('koa')
const koaBody = require('koa-body')
const koaLogger = require('koa-logger')
const bodyParser = require('koa-bodyparser')

const createModels = require('@galenjs/models')
const createRouter = require('@galenjs/models-rest')

const app = new Koa()


const bootstrap = async () => {
  const { models, remoteMethods } = await createModels({
    workspace: process.cwd(),
    modelPath: 'app/models',
    config: {
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
    }
  })
  app.context.models = models
  
  const router = await createRouter({ remoteMethods, prefix: '/v2' })

  app.use(koaLogger())
  app.use(koaBody({}))
  app.use(bodyParser())
  app.use(router.routes())
  app.use(router.allowedMethods())

  app.listen(3000, () => {
    console.info(`✅  The server is running at http://localhost:3000`)
  })
}

bootstrap()
