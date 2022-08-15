import { IsNumber, IsNotEmpty } from 'class-validator'

export class FindInputDto {
  @IsNumber()
  @IsNotEmpty()
  targetUid: number
}
