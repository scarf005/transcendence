import { IsBoolean, IsString, IsUrl } from 'class-validator'

export class RegisterUserDto {
  @IsBoolean()
  twoFactor: boolean

  @IsString()
  nickname: string

  @IsUrl()
  avata: string
}
