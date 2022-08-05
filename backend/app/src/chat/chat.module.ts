import { Module } from '@nestjs/common'
import { ChatGateway } from './chat.gateway'
import { ChatService } from './chat.service'
import { RoomsController } from './rooms.controller'

@Module({
  providers: [ChatGateway, ChatService],
  controllers: [RoomsController],
})
export class ChatModule {}
