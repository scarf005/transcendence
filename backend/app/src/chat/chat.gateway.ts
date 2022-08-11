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
import { ChatMessageDto } from './chat.dto'
import { UserService } from 'user/user.service'

@AsyncApiService()
@WebSocketGateway({ namespace: 'api/chat', cors: true })
export class ChatGateway {
  constructor(private readonly userService: UserService) {}
  @WebSocketServer()
  server: Server

  clients = []

  afterInit(server: Server) {
    console.log('chat: new server')
  }

  handleConnection(client: Socket) {
    console.log('chat: new connection')
    let token = client.handshake.auth.token
    if (token === undefined) {
      token = client.handshake.query.token
    }
    client.data.uid = this.userService.getUidFromToken(token)
    console.log('uid: ' + client.data.uid)
  }

  handleDisconnect(client: Socket) {
    console.log('chat: disconnected')
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
    client.broadcast.to(data.roomId).emit(chatEvent.RECEIVE, data)
  }

  @SubscribeMessage(chatEvent.JOIN)
  @AsyncApiPub({
    channel: chatEvent.JOIN,
    summary: '채팅방에 참가',
    description: 'user가 채팅방에 새로 입장. 알림메시지를 모든 구성원에게 전송',
    message: { name: 'roomId', payload: { type: String } },
  })
  async onJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    // TODO: 유효한 roomId인지 확인
    // TODO: banned 여부 확인
    client.join(roomId)
    console.log(`chat: ${client.data.uid} has entered to ${roomId}`)
    this.emitNotice(client, roomId, 'join')
  }

  @SubscribeMessage(chatEvent.LEAVE)
  @AsyncApiPub({
    channel: chatEvent.LEAVE,
    summary: '채팅방에서 나가기',
    description: 'user가 채팅방에서 나감. 알림메시지를 모든 구성원에게 전송',
    message: { name: 'roomId', payload: { type: String } },
  })
  async onLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    client.leave(roomId)
    console.log(`chat: ${client.data.uid} leaved ${roomId}`)
    this.emitNotice(client, roomId, 'leave')
  }

  @AsyncApiSub({
    channel: chatEvent.NOTICE,
    summary: '공지msg',
    description: 'user 입장, 퇴장 등의 메시지',
    message: { name: 'data', payload: { type: ChatMessageDto } },
  })
  async emitNotice(client, roomId: string, msg: string) {
    const data: ChatMessageDto = {
      roomId: roomId,
      senderUid: client.data.uid,
      msgContent: msg,
    }
    this.server.to(roomId).emit(chatEvent.NOTICE, data)
  }
}
