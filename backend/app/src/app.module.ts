import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PongModule } from './pong/pong.module'
import { UserModule } from './user/user.module'

import { TypeOrmModule } from '@nestjs/typeorm'
import { typeORMConfig } from './configs/typeorm.config'
import { ChatModule } from './chat/chat.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    UserModule,
    PongModule,
    ChatModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
