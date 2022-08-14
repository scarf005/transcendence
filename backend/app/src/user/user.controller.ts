import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Req,
  UseGuards,
  Post,
  Delete,
} from '@nestjs/common'
import { JwtAfterTwoFactorUserGuard } from 'auth/jwt.strategy'
import { Match } from 'pong/match.entity'
import { FindUserDto } from 'dto/findUser.dto'
import { UserService } from './user.service'
import { ApiTags, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger'

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
  async checkNickname(@Query('nickname') nickname: string) {
    return (await this.userService.findOneByNickname(nickname)) === null
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
    const user = await this.userService.findOneByUid(uid)
    if (!user) {
      throw new NotFoundException()
    }
    return user
  }

  @Get('/:uid')
  @UseGuards(JwtAfterTwoFactorUserGuard)
  @ApiOperation({
    summary: 'Get User data API',
    description: 'query string: uid',
  })
  @ApiCreatedResponse({ description: 'FindUserDto', type: FindUserDto })
  async getUserByUid(@Param('uid') uid: number): Promise<FindUserDto> {
    const user = await this.userService.findOneByUid(uid)
    if (!user) {
      throw new NotFoundException()
    }
    return user
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
  async addFreind(@Req() req: any, @Body('friendUid') friendUid: string) {
    const { uid } = req.user
    if (!friendUid) {
      throw new NotFoundException('friendUid is required')
    }
    return this.userService.addFriend(uid, +friendUid)
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
  async addBlock(@Req() req: any, @Body('blockUid') blockUid: string) {
    const { uid } = req.user
    if (!blockUid) {
      throw new NotFoundException('blockUid is required')
    }
    return this.userService.addBlock(uid, +blockUid)
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
  async deleteFriend(@Req() req: any, @Body('friendUid') friendUid: string) {
    const { uid } = req.user
    if (!friendUid) {
      throw new NotFoundException('friendUid is required')
    }
    return this.userService.deleteFriend(uid, +friendUid)
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
  async deleteBlock(@Req() req: any, @Body('blockUid') blockUid: string) {
    const { uid } = req.user
    if (!blockUid) {
      throw new NotFoundException('blockUid is required')
    }
    return this.userService.deleteBlock(uid, +blockUid)
  }
}
