import { IsString, IsNotEmpty } from 'class-validator'

export class ChangeNicknameDto {
  @IsString()
  @IsNotEmpty()
  nickname: string
}
