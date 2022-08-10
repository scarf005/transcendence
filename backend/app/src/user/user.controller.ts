import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
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
