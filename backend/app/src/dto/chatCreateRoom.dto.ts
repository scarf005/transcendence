import { ApiProperty } from '@nestjs/swagger'
import { RoomType } from 'chat/roomtype.enum'
import { IsEnum, IsString, ValidateIf } from 'class-validator'

export class ChatCreateRoomDto {
  @ApiProperty({
    description: '새 채팅방 이름',
    examples: ['test_title'],
  })
  @IsString()
  title: string

  @ApiProperty({
    description: 'PROTECTED는 암호 필요, PRIVATE은 초대받은 사용자만 입장 가능',
    enum: RoomType,
  })
  @IsEnum(RoomType)
  type: RoomType

  @ApiProperty({ description: 'bcrypted string', required: false })
  @IsString()
  @ValidateIf((o) => o.roomType === RoomType.PROTECTED)
  password?: string
}
