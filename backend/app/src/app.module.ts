import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { PongModule } from './pong/pong.module'
import { UserModule } from './user/user.module'

import { TypeOrmModule } from '@nestjs/typeorm'
import { typeORMConfig } from './configs/typeorm.config'
import { ChatModule } from './chat/chat.module'
import { AuthModule } from './auth/auth.module'
import { AvatarModule } from './avatar/avatar.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    UserModule,
    PongModule,
    ChatModule,
    AuthModule,
    AvatarModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
