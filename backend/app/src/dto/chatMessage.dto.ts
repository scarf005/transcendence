import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsNumber, IsString } from 'class-validator'

export class ChatMessageDto {
  @ApiProperty({
    description: '메시지 작성자의 유저id.\n발신땐 불필요',
    nullable: true,
    required: false,
  })
  @IsNumber()
  senderUid?: number

  @ApiProperty({ description: '메시지 본문' })
  @IsString()
  msgContent: string

  @ApiProperty({ description: '채팅방id' })
  @IsNumber()
  roomId: number

  @IsDate()
  createdAt: Date
}
