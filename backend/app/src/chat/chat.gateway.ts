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
import { UsePipes } from '@nestjs/common'
import { WSValidationPipe } from 'utils/WSValidationPipe'
import { Status } from 'user/status.enum'

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
      } else return client.disconnect()
    } else {
      try {
        const decoded = jwt.verify(token, jwtConstants.secret) as jwt.JwtPayload
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
    this.emitNotice(client, room.roomId, 'join')
    return { status: 200 }
  }

  @AsyncApiPub({
    channel: chatEvent.LEAVE,
    summary: '채팅방에서 나가기',
    description: 'user가 채팅방에서 나감. 알림메시지를 모든 구성원에게 전송',
    message: { name: 'roomId', payload: { type: Number } },
  })
  @SubscribeMessage(chatEvent.LEAVE)
  async onLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: ChatJoinRoomDto,
  ) {
    const roomId = room.roomId
    try {
      // owner가 나가면 모두에게 DESTROYED 전송. 이후 모두 내보내고 채팅방 삭제
      if (await this.chatService.isOwner(client.data.uid, roomId)) {
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
    this.emitNotice(client, roomId, 'leave')
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
    description: "user 입장시 mscContent='join', 퇴장시 'leave'",
    message: { name: 'ChatMessageDto', payload: { type: ChatMessageDto } },
  })
  async emitNotice(client, roomId: number, msg: string) {
    const data: ChatMessageDto = {
      roomId: roomId,
      senderUid: client.data.uid,
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
    this.emitNotice(client, newRoom.id, 'join')
    return { status: 200 }
  }

  @AsyncApiPub({
    channel: chatEvent.ADD_ADMIN,
    summary: 'uid를 roomId의 admin에 추가',
    message: { name: 'data', payload: { type: UserInRoomDto } },
  })
  @SubscribeMessage(chatEvent.ADD_ADMIN)
  async onAddAdmin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: UserInRoomDto,
  ) {
    if (this.chatService.isAdmin(client.data.uid, data.roomId))
      return 'You are not admin'
    try {
      await this.chatService.addUserAsAdmin(data.uid, data.roomId)
    } catch (error) {
      return error
    }
    return { status: 200 }
  }

  @AsyncApiPub({
    channel: chatEvent.REMOVE_ADMIN,
    summary: 'uid를  roomId의 admin에서 삭제',
    message: { name: 'data', payload: { type: UserInRoomDto } },
  })
  @SubscribeMessage(chatEvent.REMOVE_ADMIN)
  async onRemoveAdmin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: UserInRoomDto,
  ) {
    if (this.chatService.isAdmin(client.data.uid, data.roomId))
      return 'You are not admin'
    try {
      await this.chatService.removeUserAsAdmin(data.uid, data.roomId)
    } catch (error) {
      return error
    }
    return { status: 200 }
  }
}
