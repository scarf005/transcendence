import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { JwtAfterTwoFactorUserGuard } from 'auth/jwt.strategy'
import { UserService } from './user.service'

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/check')
  async checkNickname(@Query('nickname') nickname: string) {
    return (await this.userService.findOneByNickname(nickname)) === null
  }

  @Get('/me')
  @UseGuards(JwtAfterTwoFactorUserGuard)
  async getUserByNickname(@Req() req : any) {
    const { uid } = req.user
    const user = await this.userService.findOneByUid(uid)
    if (!user) {
      throw new NotFoundException()
    }
    return user
  }

  @Get('/:uid')
  @UseGuards(JwtAfterTwoFactorUserGuard)
  async getUserByUid(@Param('uid') uid: number) {
    const user = await this.userService.findOneByUid(uid)
    if (!user) {
      throw new NotFoundException()
    }
    return user
  }

  @Get()
  @UseGuards(JwtAfterTwoFactorUserGuard)
  async getAllUser() {
    return await this.userService.findAll()
  }
}
