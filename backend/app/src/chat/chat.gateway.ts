import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { AsyncApiPub, AsyncApiService, AsyncApiSub } from 'nestjs-asyncapi'
import { Server, Socket } from 'socket.io'
import { chatEvent } from 'configs/chat-event.constants'
import { ChatMessageDto } from 'dto/chatMessage.dto'
import { UserInRoomDto } from 'dto/userInRoom.dto'
import { ChatCreateRoomDto } from 'dto/chatCreateRoom.dto'
import { ChatJoinRoomDto } from 'dto/chatJoinRoom.dto'
import { ChatRoomDto } from 'dto/chatRoom.dto'
import { ChatService } from './chat.service'
import * as jwt from 'jsonwebtoken'
import { jwtConstants } from 'configs/jwt-token.config'
import { ChatRoom } from './chatroom.entity'
import {
  BadRequestException,
  ForbiddenException,
  UsePipes,
} from '@nestjs/common'
import { WSValidationPipe } from 'utils/WSValidationPipe'
import { Status } from 'user/status.enum'
import { ChatInviteDto } from 'dto/chatInvite.dto'
import { ChatPasswordDto } from 'dto/chatRoomPassword.dto'
import { RoomPasswordCommand } from './roomPasswordCommand.enum'
import { ChatInviteDMDto } from 'dto/chatInviteDM.dto'
import { RoomType } from './roomtype.enum'
import { ChatMuteUserDto } from 'dto/chatMuteUser.dto'
import { ChatUserEvent } from './chatuserEvent.enum'
import { ChatUserStatusChangedDto } from 'dto/chatuserStatusChanged.dto'
import { ChatBanUserDto } from 'dto/chatBanUser.dto'

/* FIXME: websocket 테스트 클라이언트에서는 cors: true 키만 있어야 동작함
추후 제출 시에는 다음과 같이 변경:
@WebSocketGateway({ namespace: 'api/chat', transports: ['websocket'] })
*/
@AsyncApiService()
@UsePipes(new WSValidationPipe())
@WebSocketGateway({ namespace: 'api/chat', cors: true })
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}
  @WebSocketServer()
  server: Server

  async handleConnection(client: Socket) {
    const { token } = client.handshake.auth
    // FIXME: prod에선 쿼리로부터 uid를 확인할 필요 없음
    if (token === undefined) {
      const uid = Number(client.handshake.query.uid)
      if (uid !== undefined) {
        client.data.uid = Number(client.handshake.query.uid)
      } else {
        return client.disconnect()
      }
    } else {
      try {
        const decoded = jwt.verify(
          token.trim(),
          jwtConstants.secret,
        ) as jwt.JwtPayload
        if (decoded.uidType !== 'user' || decoded.twoFactorPassed !== true) {
          return client.disconnect()
        }
        client.data.uid = decoded.uid
      } catch {
        return client.disconnect()
      }
    }

    try {
      await this.chatService.changeStatus(client.data.uid, Status.ONLINE)
    } catch (error) {
      return error
    }
    try {
      const rooms = await this.chatService.findRoomsByUserId(client.data.uid)
      rooms.forEach((el) => {
        client.join(el.id.toString())
        console.log(`${client.data.uid} was joined to ${el.id}`)
      })
    } catch (error) {
      return error
    }
    console.log(`chat: uid ${client.data.uid} connected.`)
  }

  async handleDisconnect(client: Socket) {
    try {
      await this.chatService.changeStatus(client.data.uid, Status.OFFLINE)
    } catch (error) {
      return error
    }
    console.log(`chat: uid ${client.data.uid} disconnected`)
  }

  @AsyncApiPub({
    channel: chatEvent.SEND,
    summary: '클라이언트->서버로 메시지 전송',
    message: { name: 'ChatMessageDto', payload: { type: ChatMessageDto } },
  })
  @SubscribeMessage(chatEvent.SEND)
  async onSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ChatMessageDto,
  ) {
    let isMuted: boolean
    try {
      isMuted = await this.chatService.isMuted(client.data.uid, data.roomId)
    } catch (error) {
      return error
    }
    if (!isMuted) {
      console.log(`chat: ${client.data.uid} sent ${data.msgContent}`)
      this.broadcastMessage(client, data)
    } else {
      console.log(
        `chat: ${client.data.uid} sent message but is muted in ${data.roomId}`,
      )
    }
    return { status: 200 }
  }

  @AsyncApiSub({
    channel: chatEvent.RECEIVE,
    summary: '다른 사용자의 메시지를 서버->클라이언트로 전송',
    message: { name: 'ChatMessageDto', payload: { type: ChatMessageDto } },
  })
  async broadcastMessage(client, data: ChatMessageDto) {
    data.senderUid = client.data.uid
    data.createdAt ??= new Date()
    // sender를 블록하지 않은 모든 사람에게 전송 (sender자신 포함)
    const sockets = await this.server.in(data.roomId.toString()).fetchSockets()
    const excludeList = await this.chatService.findBlockedMeUsers(
      data.senderUid,
    )
    sockets.forEach((soc) => {
      const participant = soc.data.uid
      // if (participant === data.senderUid) return
      if (excludeList.includes(participant)) return
      soc.emit(chatEvent.RECEIVE, data)
    })
  }

  @AsyncApiPub({
    channel: chatEvent.JOIN,
    summary: '채팅방에 참가',
    description: 'user가 채팅방에 새로 입장. 알림메시지를 모든 구성원에게 전송',
    message: { name: 'ChatJoinRoomDto', payload: { type: ChatJoinRoomDto } },
  })
  @SubscribeMessage(chatEvent.JOIN)
  async onJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: ChatJoinRoomDto,
  ) {
    try {
      await this.chatService.addUserToRoom(
        client.data.uid,
        room.roomId,
        room.password,
      )
    } catch (error) {
      return error
    }
    client.join(room.roomId.toString())
    console.log(`chat: ${client.data.uid} has entered to ${room.roomId}`)
    this.emitNotice(client.data.uid, room.roomId, 'join')
    return { status: 200 }
  }

  @AsyncApiPub({
    channel: chatEvent.LEAVE,
    summary: '채팅방에서 나가기',
    description: 'user가 채팅방에서 나감. 알림메시지를 모든 구성원에게 전송',
    message: { name: 'ChatJoinRoomDto', payload: { type: ChatJoinRoomDto } },
  })
  @SubscribeMessage(chatEvent.LEAVE)
  async onLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: ChatJoinRoomDto,
  ) {
    const { roomId } = room
    try {
      // owner가 나가면 모두에게 DESTROYED 전송. 이후 모두 내보내고 채팅방 삭제
      if (await this.chatService.isOwner(client.data.uid, roomId)) {
        console.log(`chat: owner ${client.data.uid} leaved ${roomId}`)
        this.emitDestroyed(client, roomId)
        return { status: 200 }
      }
    } catch (error) {
      return error
    }

    try {
      await this.chatService.removeUserFromRoom(client.data.uid, roomId)
    } catch (error) {
      return error
    }
    client.leave(roomId.toString())
    console.log(`chat: ${client.data.uid} leaved ${roomId}`)
    this.emitNotice(client.data.uid, roomId, 'leave')
    return { status: 200 }
  }

  @AsyncApiSub({
    channel: chatEvent.DESTROYED,
    summary: '채팅방 삭제됨',
    description: 'owner가 채팅방을 나갔을 때, 모든 참여자에게 이벤트 전달',
    message: { payload: { type: UserInRoomDto } },
  })
  async emitDestroyed(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: number,
  ) {
    const data: UserInRoomDto = { roomId: roomId, uid: client.data.uid }
    // 이벤트 전달
    this.server.to(roomId.toString()).emit(chatEvent.DESTROYED, data)
    // room 삭제
    this.server.in(roomId.toString()).socketsLeave(roomId.toString())
    // DB 삭제
    try {
      await this.chatService.deleteChatroom(client.data.uid, roomId)
    } catch (error) {
      return error
    }
  }

  @AsyncApiSub({
    channel: chatEvent.NOTICE,
    summary: '공지msg',
    description:
      "user 입장시 mscContent='join', 퇴장시 'leave'\n\n'banned'일 때 senderUid=밴된 당사자의 uid",
    message: { name: 'ChatMessageDto', payload: { type: ChatMessageDto } },
  })
  async emitNotice(uid: number, roomId: number, msg: string) {
    const data: ChatMessageDto = {
      roomId: roomId,
      senderUid: uid,
      msgContent: msg,
      createdAt: new Date(),
    }
    this.server.to(roomId.toString()).emit(chatEvent.NOTICE, data)
  }

  @AsyncApiPub({
    channel: chatEvent.CREATE,
    summary: '새로운 채팅방 생성',
    message: {
      name: 'ChatCreateRoomDto',
      payload: { type: ChatCreateRoomDto },
    },
  })
  @SubscribeMessage(chatEvent.CREATE)
  async onCreateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ChatCreateRoomDto,
  ) {
    let newRoom: ChatRoom
    try {
      newRoom = await this.chatService.createChatroom(
        client.data.uid,
        data.title,
        data.type,
        data.password,
      )
    } catch (error) {
      return error
    }
    client.join(newRoom.id.toString())
    console.log(`chat: ${client.data.uid} has entered to ${newRoom.id}`)
    this.emitNotice(client.data.uid, newRoom.id, 'join')
    return { status: 200 }
  }

  @AsyncApiPub({
    channel: chatEvent.ADD_ADMIN,
    summary: 'uid를 roomId의 admin에 추가',
    description: '성공하면 모든 참여자에게 CHATUSER_STATUS 이벤트 전송',
    message: { name: 'data', payload: { type: UserInRoomDto } },
  })
  @SubscribeMessage(chatEvent.ADD_ADMIN)
  async onAddAdmin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: UserInRoomDto,
  ) {
    const { roomId, uid } = data
    if ((await this.chatService.isAdmin(client.data.uid, roomId)) === false)
      return new ForbiddenException('You are not admin')
    try {
      await this.chatService.addUserAsAdmin(uid, roomId)
    } catch (error) {
      return error
    }
    this.onUserUpdateded(roomId, uid, ChatUserEvent.ADMIN_ADDED)
    return { status: 200 }
  }

  @AsyncApiPub({
    channel: chatEvent.REMOVE_ADMIN,
    summary: 'uid를  roomId의 admin에서 삭제',
    description: '성공하면 모든 참여자에게 CHATUSER_STATUS 이벤트 전송',
    message: { name: 'data', payload: { type: UserInRoomDto } },
  })
  @SubscribeMessage(chatEvent.REMOVE_ADMIN)
  async onRemoveAdmin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: UserInRoomDto,
  ) {
    const { roomId, uid } = data
    if ((await this.chatService.isAdmin(client.data.uid, roomId)) === false)
      return new ForbiddenException('You are not admin')
    try {
      await this.chatService.removeUserAsAdmin(uid, roomId)
    } catch (error) {
      return error
    }
    this.onUserUpdateded(roomId, uid, ChatUserEvent.ADMIN_REMOVED)
    return { status: 200 }
  }

  @AsyncApiPub({
    channel: chatEvent.BAN,
    summary: 'uid를 roomId의 banned 리스트에 추가',
    description:
      'admin이 아니거나 owner를 밴할 땐 403 리턴, uid나 roomId가 유효하지 않으면 400리턴',
    message: { name: 'ChatBanUserDto', payload: { type: ChatBanUserDto } },
  })
  @SubscribeMessage(chatEvent.BAN)
  async onBanUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ChatBanUserDto,
  ) {
    const { uid, roomId, banSec } = data
    // check if client is admin
    if ((await this.chatService.isAdmin(client.data.uid, roomId)) === false)
      return new ForbiddenException('You are not admin')
    // check if target is owner
    if ((await this.chatService.isOwner(uid, roomId)) === true)
      return new ForbiddenException('Owner cannot be banned')
    // add user to banned list
    try {
      await this.chatService.addBannedUser(uid, roomId, banSec)
    } catch (error) {
      return error
    }
    // 모든 참여자에게 uid가 ban 됐음을 notice
    const msg: ChatMessageDto = {
      roomId: roomId,
      senderUid: uid,
      msgContent: 'banned',
      createdAt: new Date(),
    }
    this.server.to(roomId.toString()).emit(chatEvent.NOTICE, msg)
    // let user out from room
    const sockets = await this.chatService.getSocketByUid(this.server, uid)
    sockets.forEach(async (el) => {
      console.log(`${el.data.uid} will be banned from ${roomId}`)
      // el.emit(chatEvent.NOTICE, msg)
      el.leave(roomId.toString())
    })
    return { status: 200 }
  }

  @AsyncApiPub({
    channel: chatEvent.UNBAN,
    summary: 'uid를 roomId의 banned 리스트에서 삭제',
    description:
      'admin이 아닐 땐 403 리턴, uid나 roomId가 유효하지 않으면 400리턴',
    message: { name: 'ChatBanUserDto', payload: { type: ChatBanUserDto } },
  })
  @SubscribeMessage(chatEvent.UNBAN)
  async onUnbanUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: UserInRoomDto,
  ) {
    const { uid, roomId } = data
    // check if client is admin
    if ((await this.chatService.isAdmin(client.data.uid, roomId)) === false)
      return new ForbiddenException('You are not admin')
    // delete user from banned list
    try {
      await this.chatService.addBannedUser(uid, roomId, 0)
    } catch (error) {
      return error
    }
    console.log(`chat: ${uid} is unbanned from ${roomId}`)
    return { status: 200 }
  }

  @AsyncApiPub({
    channel: chatEvent.MUTE,
    summary: 'uid를 muteSec초동안 mute시킴',
    description:
      'admin이 아닐 땐 403 리턴, uid가 보낸 메시지는 roomId내에서 muteSec초동안 아무에게도 전달되지 않음\n\n모든 참여자에게 CHATUSER_STATUS 이벤트 전송',
    message: { name: 'ChatMuteUserDto', payload: { type: ChatMuteUserDto } },
  })
  @SubscribeMessage(chatEvent.MUTE)
  async onMuteUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ChatMuteUserDto,
  ) {
    const { roomId, muteSec } = data
    const target = data.uid
    // check if client is admin
    if ((await this.chatService.isAdmin(client.data.uid, roomId)) === false)
      return new ForbiddenException('You are not admin')
    if (data.muteSec === undefined || data.muteSec === null)
      return new BadRequestException('muteSec is required')
    try {
      await this.chatService.addMuteUser(target, roomId, muteSec)
    } catch (error) {
      return error
    }
    console.log(`${target} in is muted for ${muteSec} seconds in ${roomId}`)
    this.onUserUpdateded(roomId, target, ChatUserEvent.MUTED)
    return { status: 200 }
  }

  @AsyncApiPub({
    channel: chatEvent.UNMUTE,
    summary: 'uid의 mute 상태를 해제',
    description:
      'admin이 아닐 땐 403 리턴, uid가 보낸 메시지를 roomId의 모든 참여자가 수신할 수 있음\n\n모든 참여자에게 CHATUSER_STATUS 이벤트 전송',
    message: { name: 'ChatMuteUserDto', payload: { type: ChatMuteUserDto } },
  })
  @SubscribeMessage(chatEvent.UNMUTE)
  async onUnmuteUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ChatMuteUserDto,
  ) {
    const roomId = data.roomId
    const target = data.uid
    // check if client is admin
    if ((await this.chatService.isAdmin(client.data.uid, roomId)) === false)
      return new ForbiddenException('You are not admin')
    try {
      await this.chatService.addMuteUser(target, roomId, 0)
    } catch (error) {
      return error
    }
    console.log(`${target} in is unmuted in ${roomId}`)
    this.onUserUpdateded(roomId, target, ChatUserEvent.UNMUTED)
    return { status: 200 }
  }

  @AsyncApiPub({
    channel: chatEvent.INVITE,
    summary: 'nickname을 roomID에 초대',
    description:
      'nickname이 존재하지 않으면 404 리턴, 기타 에러 400 리턴, 문제 없으면 200 리턴',
    message: { name: 'ChatInviteDto', payload: { type: ChatInviteDto } },
  })
  @SubscribeMessage(chatEvent.INVITE)
  async onInvite(
    @ConnectedSocket() client,
    @MessageBody() data: ChatInviteDto,
  ) {
    const inviter = client.data.uid
    const roomId = data.roomId
    const invitee = await this.chatService.findUidByNickname(
      data.inviteeNickname,
    )
    const isInvite = true
    // inviteeNickname이 존재하는지
    if (invitee === null) return { status: 404 }
    // inviter가 roomId에 속해있는지
    if (client.rooms.has(roomId.toString()) === false) return { status: 400 }
    // invitee의 소켓id 찾아서 room에 추가
    const sockets = await this.chatService.getSocketByUid(this.server, invitee)
    for (const soc of sockets) {
      try {
        await this.chatService.addUserToRoom(invitee, roomId, null, isInvite)
      } catch (error) {
        return error
      }
      soc.join(roomId.toString())
    }
    console.log(`chat: ${invitee} has entered to ${roomId}`)
    // room의 모두에게 NOTICE 전송
    this.emitNotice(invitee, roomId, 'join')
  }

  @AsyncApiPub({
    channel: chatEvent.INVITE_DM,
    summary: 'invitee와의 DM방 생성',
    description:
      'dm방을 새로 만들고 sender와 invitee를 집어넣음. sender와 invitee에게 "join"을 NOTICE',
    message: { name: 'ChatInviteDMDto', payload: { type: ChatInviteDMDto } },
  })
  @SubscribeMessage(chatEvent.INVITE_DM)
  async onInviteDM(
    @ConnectedSocket() client,
    @MessageBody() data: ChatInviteDMDto,
  ) {
    const inviter = client.data.uid
    const { invitee } = data
    let { title } = data
    if (title === undefined) title = `DM_with_${inviter}_and_${invitee}`
    // TODO: inviter, invitee 둘이 속한 DM방이 있는지 확인
    const room = await this.chatService.getRoomDmByUid(inviter, invitee)
    if (room) {
      return new BadRequestException(
        `DM for ${inviter} and ${invitee} already exists(roomId ${room.id})`,
      )
    }

    // TODO: inviter가 나가도 채팅방 폭파시키지 않기

    // create new DM room
    let newRoom: ChatRoom
    try {
      newRoom = await this.chatService.createChatroom(
        inviter,
        title,
        RoomType.DM,
      )
    } catch (error) {
      return error
    }
    client.join(newRoom.id.toString())
    console.log(`chat: ${inviter} has entered to ${newRoom.id}`)

    try {
      await this.chatService.addUserToRoom(invitee, newRoom.id)
    } catch (error) {
      return error
    }
    const sockets = await this.chatService.getSocketByUid(this.server, invitee)
    sockets.forEach(async (el) => {
      el.join(newRoom.id.toString())
    })
    console.log(`chat: ${invitee} has entered to ${newRoom.id}`)

    this.emitNotice(inviter, newRoom.id, 'join')
    this.emitNotice(invitee, newRoom.id, 'join')
    return { status: 200 }
  }

  @AsyncApiPub({
    channel: chatEvent.PASSWORD,
    summary: 'roomId의 password를 추가/변경/삭제',
    description: '추가하면 roomType이 PROTECTED로, 삭제하면 PUBLIC으로 바뀜',
    message: { name: 'chatPasswordDto', payload: { type: ChatPasswordDto } },
  })
  @SubscribeMessage(chatEvent.PASSWORD)
  async onPasswordCUD(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ChatPasswordDto,
  ) {
    try {
      const { uid } = client.data
      const { roomId, command, password } = data

      if (command === RoomPasswordCommand.ADD)
        this.chatService.createRoomPassword(uid, roomId, password)
      else if (command === RoomPasswordCommand.DELETE)
        this.chatService.deleteRoomPassword(uid, roomId)
      else if (command === RoomPasswordCommand.MODIFY)
        this.chatService.changeRoomPassword(uid, roomId, password)
    } catch (error) {
      return error
    }
    return { status: 200 }
  }

  @AsyncApiSub({
    channel: chatEvent.CHATUSER_STATUS,
    summary: 'room 참여자의 일부 상태 변경',
    description: 'mute, unmute, addAdmin, removeAdmin이 성공했을 때',
    message: {
      name: 'ChatUserStatusChanged',
      payload: { type: ChatUserStatusChangedDto },
    },
  })
  async onUserUpdateded(roomId: number, uid: number, eventType: ChatUserEvent) {
    const data: ChatUserStatusChangedDto = {
      roomId: roomId,
      uid: uid,
      type: eventType,
    }
    this.server.to(roomId.toString()).emit(chatEvent.CHATUSER_STATUS, data)
  }
}
