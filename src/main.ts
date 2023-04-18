import { Logger } from 'nestjs-pino'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { WxkfManagerModule } from './wxkfMannager.module'
import bodyParser from 'body-parser'

async function bootstrap() {
  const app = await NestFactory.create(WxkfManagerModule)

  const configService = app.get(ConfigService)
  const port = configService.get<string>('port')

  app.useLogger(app.get(Logger))
  const logger = app.get(Logger)

  app.use(bodyParser.text({type: 'text/xml'}))
  app.use(bodyParser.text({type: 'application/xml'}))

  await app.listen(port, () => {
    logger.log(`server started listening on port ${port}`, 'bootstrap')
  })
}

void bootstrap()