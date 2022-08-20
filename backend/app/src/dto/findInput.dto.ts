import { IsNumber, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class FindInputDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '사용자 uid' })
  targetUid: number
}
