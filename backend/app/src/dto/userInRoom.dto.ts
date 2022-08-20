import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class UserInRoomDto {
  @ApiProperty()
  @IsNumber()
  roomId: number

  @ApiProperty()
  @IsNumber()
  uid: number
}
