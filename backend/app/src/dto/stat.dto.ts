import { IsNumber } from 'class-validator'

export class StatDto {
  @IsNumber()
  win: number

  @IsNumber()
  lose: number

  @IsNumber()
  rating: number
}
