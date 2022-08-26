import { Module } from '@nestjs/common'
import { UserModule } from 'user/user.module'
import { ChatGateway } from './chat.gateway'
import { ChatService } from './chat.service'
import { RoomsController } from './rooms.controller'
import { ChatRoom } from './chatroom.entity'
import { ChatUser } from './chatuser.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BanUser } from './banuser.entity'

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([ChatRoom, ChatUser, BanUser]),
  ],
  providers: [ChatGateway, ChatService],
  controllers: [RoomsController],
  exports: [ChatGateway],
})
export class ChatModule {}
