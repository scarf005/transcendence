import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { setupAsyncApi } from './utils/setupAsyncApi'
import { setupSwagger } from './utils/setupSwagger'
import { ValidationPipe } from '@nestjs/common'
import { setupAdmin } from 'configs/setup.admin'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
    }),
  )
  await setupAsyncApi(app)
  setupSwagger(app)
  await setupAdmin(app)
  await app.listen(3000)
}
bootstrap()
