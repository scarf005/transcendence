import { IsBoolean, IsString, IsUrl, IsNotEmpty } from 'class-validator'

export class RegisterUserDto {
  @IsBoolean()
  @IsNotEmpty()
  twoFactor: boolean

  @IsString()
  @IsNotEmpty()
  nickname: string

  @IsUrl({ require_host: true })
  @IsNotEmpty()
  avatar: string
}
