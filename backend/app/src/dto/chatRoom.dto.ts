import { ApiProperty } from '@nestjs/swagger'
import { RoomType } from 'chat/roomtype.enum'
import { IsEnum, IsNumber, IsString, ValidateIf } from 'class-validator'

export class ChatRoomDto {
  @ApiProperty({
    description: 'CREATE할 때는 자동 생성, JOIN할 때는 필수',
    required: false,
  })
  @IsNumber()
  roomId?: number

  @ApiProperty({
    description: 'CREATE할 때는 필수, JOIN할 때는 필요없음',
    examples: ['test_title'],
    required: false,
  })
  @IsString()
  roomName?: string

  @ApiProperty({
    description: 'CREATE할 때는 필수, JOIN할 때는 필요없음',
    enum: RoomType,
    required: false,
  })
  @IsEnum(RoomType)
  roomType?: RoomType

  @ApiProperty({ description: 'bcrypted string', required: false })
  @IsString()
  @ValidateIf((o) => o.roomType === RoomType.PROTECTED)
  roomPassword?: string
}
