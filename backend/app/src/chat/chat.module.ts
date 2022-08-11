import { Module } from '@nestjs/common'
import { UserModule } from 'user/user.module'
import { ChatGateway } from './chat.gateway'
import { ChatService } from './chat.service'
import { RoomsController } from './rooms.controller'

@Module({
  imports: [UserModule],
  providers: [ChatGateway, ChatService],
  controllers: [RoomsController],
})
export class ChatModule {}
