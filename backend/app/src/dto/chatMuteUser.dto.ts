import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'

export class ChatMuteUserDto {
  @ApiProperty({ description: '채팅방id', examples: [1] })
  @IsNumber()
  roomId: number

  @ApiProperty({ description: 'mute할 사람의 uid' })
  @IsNumber()
  uid: number

  @ApiProperty({ description: 'uid를 mute할 시간(초)' })
  @IsNumber()
  @IsOptional()
  muteSec?: number
}
