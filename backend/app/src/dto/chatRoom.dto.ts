import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class ChatRoomDto {
  @ApiProperty()
  @IsString()
  roomName: string
  // TODO: roomType<public|private|protected>
  // TODO: roomPassword
  @ApiProperty()
  @IsNumber()
  ownerUid: number
}
