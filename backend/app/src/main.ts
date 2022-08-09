import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { setupAsyncApi } from './utils/setupAsyncApi'
import { setupSwagger } from './utils/setupSwagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  await setupAsyncApi(app)
  setupSwagger(app)
  await app.listen(3000)
}
bootstrap()
