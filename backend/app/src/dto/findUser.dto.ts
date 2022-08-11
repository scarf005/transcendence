import { IsArray, IsEnum, IsNumber, IsObject, IsString, IsUrl } from 'class-validator'
import { StatDto } from './stat.dto'
import { Status } from 'user/status.enum'

export class FindUserDto {
	@IsNumber()
	uid: number

	@IsString()
	nickname: string

	@IsUrl()
	avatar: string

	@IsEnum(Status)
	status: Status

	@IsArray()
	friends: number[]

	@IsArray()
	blocks: number[]

	@IsObject()
	stat: StatDto
}