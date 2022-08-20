import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class ChangeNicknameDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '변경할 이름', example: 'foo' })
  nickname: string
}
