const Koa = require('koa')
const koaBody = require('koa-body')
const koaLogger = require('koa-logger')
const bodyParser = require('koa-bodyparser')

const createRouter = require('@galenjs/models-rest')

const bindContext = require('./context')

const bootstrap = async () => {
  await bindContext()

  const app = new Koa()
  
  const router = await createRouter({
    remoteMethods: app.context.remoteMethods,
    prefix: '/v2'
  })

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
