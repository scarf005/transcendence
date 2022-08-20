import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class ChatInviteDto {
  @ApiProperty({ description: '채팅방id', examples: [1] })
  @IsNumber()
  roomId: number

  @ApiProperty({
    description: '초대받은사람의 닉네임',
  })
  @IsString()
  inviteeNickname: string
}
