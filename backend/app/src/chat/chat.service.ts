import { Injectable } from '@nestjs/common'
import { ChatRoomDto, ChatRoomStatusDto } from './chat.dto'

@Injectable()
export class ChatService {
  private maxRoomId = 0
  private channels: ChatRoomStatusDto[] = []

  getAllChatrooms() {
    return this.channels
  }

  createChatroom(roomDto: ChatRoomDto) {
    console.log(this.maxRoomId)
    this.maxRoomId++
    const item: ChatRoomStatusDto = {
      roomId: this.maxRoomId.toString(),
      roomName: roomDto.roomName,
      ownerUid: roomDto.ownerUid,
      adminUid: [roomDto.ownerUid],
      joinedUsers: [roomDto.ownerUid],
    }
    this.channels.push(item)
    return item
  }
  /*
  enterChatroom(client: Socket, roomId: string) {
    client.join(roomId)
    const msg = 
    client.to(roomId).emit(chatEvent.NOTICE,)

  }*/
}
