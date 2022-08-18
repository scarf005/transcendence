import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class ChatJoinRoomDto {
  @ApiProperty({
    description: '채팅방 고유 번호',
  })
  @IsNumber()
  roomId: number

  @ApiProperty({ description: 'bcrypted string', required: false })
  @IsString()
  @IsOptional()
  password?: string
}
