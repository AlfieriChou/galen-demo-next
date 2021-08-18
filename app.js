const Koa = require('koa')
const koaBody = require('koa-body')
const koaLogger = require('koa-logger')
const bodyParser = require('koa-bodyparser')

const createModels = require('@galenjs/models')
const createRouter = require('@galenjs/models-rest')

const app = new Koa()


const bootstrap = async () => {
  const {
    models,
    modelDefs,
    jsonSchemas,
    remoteMethods
  } = await createModels({
    workspace: process.cwd(),
    modelDefPath: 'app/modelDef',
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

  app.modelDefs = modelDefs
  app.jsonSchemas = jsonSchemas
  app.remoteMethods = remoteMethods
  app.context.models = models
  app.context.app = app
  
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
