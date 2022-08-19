import { Controller, Get, UseGuards, Req, Param } from '@nestjs/common'
import { ChatRoomDto } from 'dto/chatRoom.dto'
import { ChatService } from './chat.service'
import { ApiTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { JwtAfterTwoFactorUserGuard } from 'auth/jwt.strategy'
import { ChatUser } from './chatuser.entity'

@Controller('/api/chat')
@ApiTags('채팅 API')
export class RoomsController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/list')
  @UseGuards(JwtAfterTwoFactorUserGuard)
  @ApiOperation({
    summary: 'private 를 제외한 모든 채팅방을 가져오는 API',
  })
  @ApiOkResponse({ type: ChatRoomDto, isArray: true })
  getChatroomList() {
    return this.chatService.getAllChatrooms()
  }

  @Get('/joinlist')
  @UseGuards(JwtAfterTwoFactorUserGuard)
  @ApiOperation({
    summary: '본인이 들어간 방과 privatef 를 제외한 모든 채팅방을 가져오는 API',
    description: 'auth token 에서 uid 추출',
  })
  @ApiOkResponse({ type: ChatRoomDto, isArray: true })
  getJoinChatroomList(@Req() req: any) {
    const { uid } = req.user
    return this.chatService.getJoinChatrooms(uid)
  }

  @Get('/me')
  @UseGuards(JwtAfterTwoFactorUserGuard)
  @ApiOperation({
    summary: '본인이 들어간 채팅방 리스트를 가져오는 API',
    description: 'auth token 에서 uid 추출',
  })
  @ApiOkResponse({ type: ChatRoomDto, isArray: true })
  getMyChatroomList(@Req() req: any) {
    const { uid } = req.user
    return this.chatService.findRoomsByUserId(uid)
  }

  @Get('/:id/list')
  @UseGuards(JwtAfterTwoFactorUserGuard)
  @ApiOperation({
    summary: '채팅방 id로 채탕방의 유저 목록을 가져오는 API',
    description: 'param 에서 id 추출',
  })
  @ApiOkResponse({ type: ChatUser, isArray: true })
  getChatroomUserList(@Param('id') id: number) {
    return this.chatService.findRoomByRoomid(id)
  }
}
