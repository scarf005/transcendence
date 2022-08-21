import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class ChatInviteDMDto {
  @ApiProperty({
    description: 'DM방 title',
  })
  @IsString()
  @IsOptional()
  title?: string

  @ApiProperty({
    description: 'DM 받을 사람의 uid',
  })
  @IsNumber()
  invitee: number
}
