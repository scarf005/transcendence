import { IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class StatDto {
  @IsNumber()
  @ApiProperty({ description: '승리한 사용자 uid' })
  win: number

  @IsNumber()
  @ApiProperty({ description: '패배한 사용자 uid' })
  lose: number

  @IsNumber()
  rating: number
}
