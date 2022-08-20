import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class VerifyTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '2fa 토큰' })
  token: string
}
