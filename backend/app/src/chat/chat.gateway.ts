import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { chatEvent } from 'src/configs/chatEvent.constants'
import { ChatMessageDto } from './chat.dto'

@WebSocketGateway({ namespace: 'chat', cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server

  clients = []

  afterInit(server: Server) {
    console.log('chat:', 'new server')
  }

  handleConnection(client: Socket) {
    console.log('chat:', 'new connection')
  }

  handleDisconnect(client: Socket) {
    console.log('chat:', 'disconnected')
  }

  @SubscribeMessage(chatEvent.JOIN)
  onJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ChatMessageDto,
  ) {
    const { senderId, roomId } = data
    client.join(roomId)
    console.log('chat:', senderId + ' has entered to ' + roomId)
    this.server.to(roomId).emit(chatEvent.NOTICE, senderId + ' has entered!!')
    this.clients.push(client)
  }

  @SubscribeMessage(chatEvent.SEND)
  onSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() msg: ChatMessageDto,
  ) {
    const { senderId, msgContent, roomId } = msg
    console.log('chat:', senderId + '(' + client.id + ') sent: ' + msgContent)
    client.broadcast.to(roomId).emit(chatEvent.RECEIVE, msg)
  }
}
