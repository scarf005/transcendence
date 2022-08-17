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
import { ChatRoomDto } from 'dto/chatRoom.dto'
import { ChatService } from './chat.service'
import * as jwt from 'jsonwebtoken'
import { jwtConstants } from 'configs/jwt-token.config'
import { ChatRoom } from './chatroom.entity'

@AsyncApiService()
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
      const rooms = await this.chatService.findRoomsByUserId(client.data.uid)
      rooms.forEach((el) => {
        client.join(el.id.toString())
        console.log(`${client.data.uid} was joined to ${el.id}`)
      })
    } catch (error) {
      return error
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
    message: { name: 'ChatMessageDto', payload: { type: ChatMessageDto } },
  })
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
  }

  @AsyncApiSub({
    channel: chatEvent.RECEIVE,
    summary: '다른 사용자의 메시지를 서버->클라이언트로 전송',
    message: { name: 'ChatMessageDto', payload: { type: ChatMessageDto } },
  })
  async broadcastMessage(client, data: ChatMessageDto) {
    // TODO: block 여부 확인
    data.senderUid = client.data.uid
    data.createdAt ??= new Date()
    client.broadcast.to(data.roomId.toString()).emit(chatEvent.RECEIVE, data)
  }

  @SubscribeMessage(chatEvent.JOIN)
  @AsyncApiPub({
    channel: chatEvent.JOIN,
    summary: '채팅방에 참가',
    description: 'user가 채팅방에 새로 입장. 알림메시지를 모든 구성원에게 전송',
    message: { name: 'ChatRoomDto', payload: { type: ChatRoomDto } },
  })
  async onJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: ChatRoomDto,
  ) {
    try {
      await this.chatService.addUserToRoom(
        client.data.uid,
        room.roomId,
        room.roomPassword,
      )
    } catch (error) {
      return error
    }
    client.join(room.roomId.toString())
    console.log(`chat: ${client.data.uid} has entered to ${room.roomId}`)
    this.emitNotice(client, room.roomId, 'join')
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
    try {
      await this.chatService.removeUserFromRoom(client.data.uid, roomId)
    } catch (error) {
      return error
    }
    // TODO: 마지막 유저가 나가면 채팅방 삭제
    client.leave(roomId.toString())
    console.log(`chat: ${client.data.uid} leaved ${roomId}`)
    this.emitNotice(client, roomId, 'leave')
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
    message: { name: 'ChatRoomDto', payload: { type: ChatRoomDto } },
  })
  @SubscribeMessage(chatEvent.CREATE)
  async onCreateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ChatRoomDto,
  ) {
    let newRoom: ChatRoom
    try {
      newRoom = await this.chatService.createChatroom(
        client.data.uid,
        data.roomName,
        data.roomType,
        data.roomPassword,
      )
    } catch (error) {
      return error
    }
    client.join(newRoom.id.toString())
    console.log(`chat: ${client.data.uid} has entered to ${newRoom.id}`)
    this.emitNotice(client, newRoom.id, 'join')
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
  }
}
