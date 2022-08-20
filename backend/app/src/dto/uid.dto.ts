import { IsNotEmpty, IsNumberString } from 'class-validator'

export class UidDto {
  @IsNumberString()
  @IsNotEmpty()
  uid: string
}
