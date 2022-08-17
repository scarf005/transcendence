import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
  Post,
  Delete,
} from '@nestjs/common'
import { JwtAfterTwoFactorUserGuard } from 'auth/jwt.strategy'
import { FindUserDto } from 'dto/findUser.dto'
import { UserService } from './user.service'
import { ApiTags, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger'
import { CheckInputDto } from 'dto/checkInput.dto'
import { FindInputDto } from 'dto/findInput.dto'
import { ChangeNicknameDto } from 'dto/changeNickname.dto'

@Controller('api/user')
@ApiTags('유저 API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/check')
  @ApiOperation({ summary: '닉네임 체크 API', description: '유저 닉네임' })
  @ApiCreatedResponse({
    description: '중복이면 true, 아니면 false',
    type: Boolean,
  })
  async checkNickname(@Query() query: CheckInputDto) {
    return (await this.userService.findOneByNickname(query.nickname)) === null
  }

  @Get('/me')
  @UseGuards(JwtAfterTwoFactorUserGuard)
  @ApiOperation({
    summary: 'Get My User data API',
    description: 'auth token 에서 uid 추출',
  })
  @ApiCreatedResponse({ description: 'FindUserDto', type: FindUserDto })
  async getMyData(@Req() req: any): Promise<FindUserDto> {
    const { uid } = req.user
    return await this.userService.findOneByUid(uid)
  }

  @Get('/:uid')
  @UseGuards(JwtAfterTwoFactorUserGuard)
  @ApiOperation({
    summary: 'Get User data API',
    description: 'query string: uid',
  })
  @ApiCreatedResponse({ description: 'FindUserDto', type: FindUserDto })
  async getUserByUid(@Param() param: FindInputDto): Promise<FindUserDto> {
    return await this.userService.findOneByUid(param.targetUid)
  }

  @Get()
  @UseGuards(JwtAfterTwoFactorUserGuard)
  @ApiOperation({ summary: 'Get all user API', description: '' })
  @ApiCreatedResponse({
    description: 'FindUserDto[]',
    type: Array<FindUserDto>,
  })
  async getAllUser(): Promise<FindUserDto[]> {
    return await this.userService.findAll()
  }

  @Post('/nickname')
  @UseGuards(JwtAfterTwoFactorUserGuard)
  @ApiOperation({
    summary: 'Post nickname API',
    description: 'nickname 변경',
  })
  @ApiCreatedResponse({
    description: 'ok : 추가됐다, no : exception',
    type: String,
  })
  async changeNickname(@Req() req: any, @Body() body: ChangeNicknameDto) {
    const { uid } = req.user
    return this.userService.changeNickname(uid, body.nickname)
  }

  @Post('/friend')
  @UseGuards(JwtAfterTwoFactorUserGuard)
  @ApiOperation({
    summary: 'Post friend API',
    description: 'body의 friendUid:uid 추가할 uid',
  })
  @ApiCreatedResponse({
    description: 'ok : 추가됐다, no : exception',
    type: String,
  })
  async addFreind(@Req() req: any, @Body() body: FindInputDto) {
    const { uid } = req.user
    return this.userService.addFriend(uid, body.targetUid)
  }

  @Post('/block')
  @UseGuards(JwtAfterTwoFactorUserGuard)
  @ApiOperation({
    summary: 'Post block API',
    description: 'body의 blockUid:uid 추가할 uid',
  })
  @ApiCreatedResponse({
    description: 'ok : 추가됐다, no : exception',
    type: String,
  })
  async addBlock(@Req() req: any, @Body() body: FindInputDto) {
    const { uid } = req.user
    return this.userService.addBlock(uid, body.targetUid)
  }

  @Delete('/friend')
  @UseGuards(JwtAfterTwoFactorUserGuard)
  @ApiOperation({
    summary: 'Delete friend API',
    description: 'body의 friendUid:uid 제거할 uid',
  })
  @ApiCreatedResponse({
    description: 'ok : 제거됐다, no : exception',
    type: String,
  })
  async deleteFriend(@Req() req: any, @Body() body: FindInputDto) {
    const { uid } = req.user
    return this.userService.deleteFriend(uid, body.targetUid)
  }

  @Delete('/block')
  @UseGuards(JwtAfterTwoFactorUserGuard)
  @ApiOperation({
    summary: 'delete block API',
    description: 'body의 blockUid:uid 제거할 uid',
  })
  @ApiCreatedResponse({
    description: 'ok : 추가됐다, no : exception',
    type: String,
  })
  async deleteBlock(@Req() req: any, @Body() body: FindInputDto) {
    const { uid } = req.user
    return this.userService.deleteBlock(uid, body.targetUid)
  }
}
