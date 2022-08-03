import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
