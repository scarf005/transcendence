import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsEnum } from 'class-validator'
import { Status } from 'user/status.enum'

export class UserStatusDto {
  @ApiProperty({ description: '상태변경된 사용자 uid' })
  @IsNumber()
  uid: number

  @ApiProperty({ description: 'uid의 변경된 상태', enum: Status })
  @IsEnum(Status)
  status: Status
}
