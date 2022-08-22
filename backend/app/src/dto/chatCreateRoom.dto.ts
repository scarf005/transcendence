import { ApiProperty } from '@nestjs/swagger'
import { RoomType } from 'chat/roomtype.enum'
import { IsEnum, IsString, Length, ValidateIf } from 'class-validator'

export class ChatCreateRoomDto {
  @ApiProperty({
    description: '새 채팅방 이름(최소1글자 ~ 최대30글자)',
    examples: ['test_title'],
    minLength: 1,
    maxLength: 30,
  })
  @IsString()
  @Length(1, 30)
  title: string

  @ApiProperty({
    description:
      'PROTECTED는 암호 필요, PRIVATE은 초대받은 사용자만 입장 가능\n\nDM은 CREATE로 만들 수 없고, INVITE_DM을 써야 함',
    enum: RoomType,
  })
  @IsEnum(RoomType)
  type: RoomType

  @ApiProperty({ description: 'bcrypted string', required: false })
  @IsString()
  @ValidateIf((o) => o.roomType === RoomType.PROTECTED)
  password?: string
}
