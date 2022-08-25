import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumberString } from 'class-validator'

export class UidDto {
  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty({ description: '사용자 uid' })
  uid: string
}
