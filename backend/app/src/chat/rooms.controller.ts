import { Controller, Get, Post, Body } from '@nestjs/common'
import { ChatRoomDto, ChatRoomStatusDto } from './chat.dto'
import { ChatService } from './chat.service'
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger'

@Controller('/api/chat')
@ApiTags('채팅 API')
export class RoomsController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/list')
  @ApiOkResponse({ type: ChatRoomStatusDto, isArray: true })
  getChatroomList() {
    return this.chatService.getAllChatrooms()
  }

  @Post('/create')
  @ApiCreatedResponse({
    description: '새로운 채팅방 생성',
    type: ChatRoomStatusDto,
  })
  createChatroom(@Body() roomdto: ChatRoomDto) {
    return this.chatService.createChatroom(roomdto)
  }
}
