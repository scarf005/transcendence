import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator'

export class ChatMessageDto {
  @ApiProperty({
    description: '메시지 작성자의 유저id.\n발신땐 불필요',
    nullable: true,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  senderUid?: number

  @ApiProperty({
    description: '메시지 본문',
    examples: ['this is sample message'],
  })
  @IsString()
  msgContent: string

  @ApiProperty({ description: '채팅방id', examples: [1] })
  @IsNumber()
  roomId: number

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @ApiProperty({ description: '생성일' })
  createdAt?: Date

  @ApiProperty({
    description: '게임 초대시 상대방 id. 포함 시 게임 초대 메시지로 변함',
    nullable: true,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  inviteUid?: number
}
