import { Controller, Get } from '@nestjs/common'
import { ChatRoomStatusDto } from './chat.dto'
import { ChatService } from './chat.service'
import { ApiTags, ApiOkResponse } from '@nestjs/swagger'

@Controller('/api/chat')
@ApiTags('채팅 API')
export class RoomsController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/list')
  @ApiOkResponse({ type: ChatRoomStatusDto, isArray: true })
  getChatroomList() {
    return this.chatService.getAllChatrooms()
  }
}
