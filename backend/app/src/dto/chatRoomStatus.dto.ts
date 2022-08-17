import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNumber } from 'class-validator'
import { ChatRoomDto } from './chatRoom.dto'

export class ChatRoomStatusDto extends ChatRoomDto {
  @ApiProperty()
  @IsNumber()
  ownerUid: number

  @ApiProperty()
  @IsArray()
  adminUid: number[]

  @ApiProperty()
  @IsArray()
  joinedUsers: number[]
}
