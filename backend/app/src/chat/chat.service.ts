import { Injectable } from '@nestjs/common'
import { ChatroomDto, ChatroomStatusDto } from './chat.dto'

@Injectable()
export class ChatService {
  private maxRoomId = 0
  private channels: ChatroomStatusDto[] = []

  getAllChatrooms() {
    return this.channels
  }

  createChatroom(roomDto: ChatroomDto) {
    console.log(this.maxRoomId)
    this.maxRoomId++
    const item: ChatroomStatusDto = {
      roomId: this.maxRoomId.toString(),
      roomName: roomDto.roomName,
      ownerId: roomDto.ownerId,
      adminId: [roomDto.ownerId],
      joinedUsers: [roomDto.ownerId],
    }
    this.channels.push(item)
  }
  /*
  enterChatroom(client: Socket, roomId: string) {
    client.join(roomId)
    const msg = 
    client.to(roomId).emit(chatEvent.NOTICE,)

  }*/
}
