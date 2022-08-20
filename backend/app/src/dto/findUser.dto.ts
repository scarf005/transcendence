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
  @ApiProperty({ description: 'user id' })
  uid: number

  @IsString()
  @ApiProperty({ description: 'nickname' })
  nickname: string

  @IsUrl()
  @ApiProperty({ description: 'avatar path' })
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
  @ApiProperty({ description: '유저의 stat' })
  stat: StatDto
}
