import { ApiProperty } from '@nestjs/swagger'
import { RoomPasswordCommand } from 'chat/roomPasswordCommand.enum'
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator'

export class ChatPasswordDto {
  @ApiProperty({
    description: '대상 채팅방 id',
    examples: [1],
  })
  @IsNumber()
  roomId: number

  @ApiProperty({
    description: '추가/변경/삭제',
    enum: RoomPasswordCommand,
  })
  @IsEnum(RoomPasswordCommand)
  command: RoomPasswordCommand

  @ApiProperty({
    description: 'bcrypted string\n\n새 비밀번호(추가, 변경시)',
    required: false,
  })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.command !== RoomPasswordCommand.DELETE)
  password?: string
}
