import { ApiProperty } from '@nestjs/swagger'

export class ChatRoomDto {
  @ApiProperty()
  roomName: string
  // TODO: roomType<public|private|protected>
  // TODO: roomPassword
  @ApiProperty()
  ownerUid: number
}

export class ChatRoomStatusDto extends ChatRoomDto {
  @ApiProperty()
  roomId: number
  @ApiProperty()
  adminUid: Array<number>
  @ApiProperty()
  joinedUsers: Array<number>
}

export class ChatMessageDto {
  @ApiProperty({
    description: '메시지 작성자의 유저id.\n발신땐 불필요',
    nullable: true,
  })
  senderUid?: number
  @ApiProperty({ description: '메시지 본문' })
  msgContent: string
  @ApiProperty({ description: '채팅방id' })
  roomId: number
}

export class UserInRoomDto {
  @ApiProperty()
  roomId: number
  @ApiProperty()
  uid: number
}
