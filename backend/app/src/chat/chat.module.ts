import { Module } from '@nestjs/common'
import { UserModule } from 'user/user.module'
import { ChatGateway } from './chat.gateway'
import { ChatService } from './chat.service'
import { RoomsController } from './rooms.controller'
import { ChatRoom } from './chatroom.entity'
import { ChatUser } from './chatuser.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([ChatRoom, ChatUser])],
  providers: [ChatGateway, ChatService],
  controllers: [RoomsController],
})
export class ChatModule {}
