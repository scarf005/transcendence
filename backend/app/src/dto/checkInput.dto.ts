import { IsString, IsNotEmpty } from 'class-validator'

export class CheckInputDto {
  @IsString()
  @IsNotEmpty()
  nickname: string
}
