import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'

export class ChatBanUserDto {
  @ApiProperty({ description: '채팅방id', examples: [1] })
  @IsNumber()
  roomId: number

  @ApiProperty({ description: 'ban할 사람의 uid' })
  @IsNumber()
  uid: number

  @ApiProperty({ description: 'uid를 ban할 시간(초)' })
  @IsNumber()
  banSec: number
}
