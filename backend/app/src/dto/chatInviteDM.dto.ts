import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class ChatInviteDMDto {
  @ApiProperty({
    description: 'DM 받을 사람의 uid',
  })
  @IsNumber()
  invitee: number
}
