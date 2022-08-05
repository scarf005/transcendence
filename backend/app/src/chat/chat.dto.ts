export class ChatroomDto {
  roomName: string
  // TODO: roomType<public|private|protected>
  // TODO: roomPassword
  ownerId: string
}

export class ChatroomStatusDto extends ChatroomDto {
  roomId: string
  adminId: Array<string>
  joinedUsers: Array<string>
}

export class ChatMessageDto {
  senderId: string
  msgContent: string
  roomId: string
}
