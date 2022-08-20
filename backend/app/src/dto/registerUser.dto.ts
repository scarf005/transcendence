import { IsBoolean, IsString, IsUrl, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterUserDto {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ description: '2FA 사용 여부' })
  twoFactor: boolean

  @IsString()
  @IsNotEmpty()
  nickname: string

  @IsUrl({ require_host: false })
  @IsNotEmpty()
  avatar: string
}
