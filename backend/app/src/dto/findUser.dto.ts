import {
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsString,
  IsUrl,
} from 'class-validator'
import { StatDto } from './stat.dto'
import { Status } from 'user/status.enum'
import { ApiProperty } from '@nestjs/swagger'

export class FindUserDto {
  @IsNumber()
  uid: number

  @IsString()
  nickname: string

  @IsUrl()
  avatar: string

  @IsEnum(Status)
  @ApiProperty({ enum: Status })
  status: Status

  @IsArray()
  @ApiProperty({ description: 'uid 목록' })
  friends: number[]

  @IsArray()
  @ApiProperty({ description: 'uid 목록' })
  blocks: number[]

  @IsObject()
  stat: StatDto
}
