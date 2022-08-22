import { ApiProperty } from '@nestjs/swagger'
import { ChatUserEvent } from 'chat/chatuserEvent.enum'
import { IsNumber, IsEnum } from 'class-validator'

export class ChatUserStatusChangedDto {
  @ApiProperty({
    description: '채팅방 고유 번호',
  })
  @IsNumber()
  roomId: number

  @ApiProperty({
    description: '상태가 변한 사람의 uid',
  })
  @IsNumber()
  uid: number

  @ApiProperty({
    description: '발생한 이벤트 종류',
    enum: ChatUserEvent,
  })
  @IsEnum(ChatUserEvent)
  type: ChatUserEvent
}
