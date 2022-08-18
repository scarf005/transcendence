import { Controller, Get, UseGuards, Req } from '@nestjs/common'
import { ChatRoomDto } from 'dto/chatRoom.dto'
import { ChatService } from './chat.service'
import { ApiTags, ApiOkResponse } from '@nestjs/swagger'
import { JwtAfterTwoFactorUserGuard } from 'auth/jwt.strategy'

@Controller('/api/chat')
@ApiTags('채팅 API')
export class RoomsController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/list')
  @UseGuards(JwtAfterTwoFactorUserGuard)
  @ApiOkResponse({ type: ChatRoomDto, isArray: true })
  getChatroomList() {
    return this.chatService.getAllChatrooms()
  }

  @Get('/joinlist')
  @UseGuards(JwtAfterTwoFactorUserGuard)
  @ApiOkResponse({ type: ChatRoomDto, isArray: true })
  getJoinChatroomList(@Req() req: any) {
    const { uid } = req.user
    return this.chatService.getJoinChatrooms(uid)
  }

  @Get('/me')
  @UseGuards(JwtAfterTwoFactorUserGuard)
  @ApiOkResponse({ type: ChatRoomDto, isArray: true })
  getMyChatroomList(@Req() req: any) {
    const { uid } = req.user
    return this.chatService.findRoomsByUserId(uid)
  }
}
