import { IsString, IsNotEmpty } from 'class-validator'

export class FileNameDto {
  @IsString()
  @IsNotEmpty()
  filename: string
}
