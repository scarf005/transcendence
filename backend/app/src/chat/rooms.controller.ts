import { Controller, Get, Post, Body } from '@nestjs/common'
import { ChatroomDto } from './chat.dto'
import { ChatService } from './chat.service'

@Controller('/api/chat')
export class RoomsController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/list')
  getChatroomList() {
    return this.chatService.getAllChatrooms()
  }

  @Post('/create')
  createChatroom(@Body() roomdto: ChatroomDto) {
    this.chatService.createChatroom(roomdto)
  }
}
