import { IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class FileNameDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '파일명' })
  filename: string
}
