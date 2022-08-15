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
import { ChatMessageDto, UserInRoomDto } from 'dto/chat.dto'
import { ChatService } from './chat.service'
import * as jwt from 'jsonwebtoken'
import { jwtConstants } from 'configs/jwt-token.config'

@AsyncApiService()
@WebSocketGateway({ namespace: 'api/chat', cors: true })
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}
  @WebSocketServer()
  server: Server

  clients = []

  handleConnection(client: Socket) {
    const { token } = client.handshake.auth
    // FIXME: prod에선 쿼리로부터 uid를 확인할 필요 없음
    if (token === undefined) {
      const uid = Number(client.handshake.query.uid)
      if (uid !== undefined) {
        client.data.uid = Number(client.handshake.query.uid)
        console.log(`chat: uid ${client.data.uid} connected.`)
        return
      } else return client.disconnect()
    }
    try {
      const decoded = jwt.verify(token, jwtConstants.secret) as jwt.JwtPayload
      if (decoded.uidType !== 'user' || decoded.twoFactorPassed !== true) {
        return client.disconnect()
      }
      client.data.uid = decoded.uid
    } catch {
      return client.disconnect()
    }
    // TODO: change user status to online
    console.log(`chat: uid ${client.data.uid} connected.`)
  }

  handleDisconnect(client: Socket) {
    // TODO: change user status to offline
    console.log(`chat: uid ${client.data.uid} disconnected`)
  }

  @SubscribeMessage(chatEvent.SEND)
  @AsyncApiPub({
    channel: chatEvent.SEND,
    summary: '클라이언트->서버로 메시지 전송',
    message: { name: 'data', payload: { type: ChatMessageDto } },
  })
  async onSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ChatMessageDto,
  ) {
    // TODO: sender가 mute상태인지 확인
    console.log(`chat: ${client.data.uid} sent ${data.msgContent}`)
    this.broadcastMessage(client, data)
  }

  @AsyncApiSub({
    channel: chatEvent.RECEIVE,
    summary: '다른 사용자의 메시지를 서버->클라이언트로 전송',
    message: { name: 'data', payload: { type: ChatMessageDto } },
  })
  async broadcastMessage(client, data: ChatMessageDto) {
    // TODO: block 여부 확인
    data.senderUid = client.data.uid
    client.broadcast.to(data.roomId.toString()).emit(chatEvent.RECEIVE, data)
  }

  @SubscribeMessage(chatEvent.JOIN)
  @AsyncApiPub({
    channel: chatEvent.JOIN,
    summary: '채팅방에 참가',
    description: 'user가 채팅방에 새로 입장. 알림메시지를 모든 구성원에게 전송',
    message: { name: 'roomId', payload: { type: Number } },
  })
  async onJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: number,
  ) {
    // TODO: 유효한 roomId인지 확인
    // TODO: banned 여부 확인
    this.chatService.addUserToRoom(client.data.uid, roomId)
    client.join(roomId.toString())
    console.log(`chat: ${client.data.uid} has entered to ${roomId}`)
    this.emitNotice(client, roomId, 'join')
  }

  @SubscribeMessage(chatEvent.LEAVE)
  @AsyncApiPub({
    channel: chatEvent.LEAVE,
    summary: '채팅방에서 나가기',
    description: 'user가 채팅방에서 나감. 알림메시지를 모든 구성원에게 전송',
    message: { name: 'roomId', payload: { type: Number } },
  })
  async onLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: number,
  ) {
    this.chatService.removeUserFromRoom(client.data.uid, roomId)
    client.leave(roomId.toString())
    console.log(`chat: ${client.data.uid} leaved ${roomId}`)
    this.emitNotice(client, roomId, 'leave')
  }

  @AsyncApiSub({
    channel: chatEvent.NOTICE,
    summary: '공지msg',
    description: 'user 입장, 퇴장 등의 메시지',
    message: { name: 'data', payload: { type: ChatMessageDto } },
  })
  async emitNotice(client, roomId: number, msg: string) {
    const data: ChatMessageDto = {
      roomId: roomId,
      senderUid: client.data.uid,
      msgContent: msg,
    }
    this.server.to(roomId.toString()).emit(chatEvent.NOTICE, data)
  }

  @AsyncApiPub({
    channel: chatEvent.CREATE,
    summary: '새로운 채팅방 생성',
    message: { name: 'room_title', payload: { type: String } },
  })
  @SubscribeMessage(chatEvent.CREATE)
  async onCreateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() title: string,
  ) {
    const newRoom = await this.chatService.createChatroom(
      client.data.uid,
      title,
    )
    this.onJoinRoom(client, newRoom.id)
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
    // client가 현재 admin이고, 새 admin이 현재 chatroom의 참가자라면
    if (this.chatService.isAdmin(client.data.uid, data.roomId))
      this.chatService.addUserAsAdmin(data.uid, data.roomId)
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
    // client가 현재 admin이고, 새 admin이 현재 chatroom의 참가자라면
    if (this.chatService.isAdmin(client.data.uid, data.roomId))
      this.chatService.removeUserAsAdmin(data.uid, data.roomId)
  }
}
