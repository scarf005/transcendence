import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class CheckInputDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '입력한 문자열' })
  nickname: string
}
