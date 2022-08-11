import {
  Controller,
  Put,
  UseGuards,
  Req,
  Delete,
  Get,
  Query,
  UnauthorizedException,
} from '@nestjs/common'

import { TwoFactorService } from './two-factor.service'
import { UserService } from 'user/user.service'
import {
  JwtAfterTwoFactorUserGuard,
  JwtBeforeTwoFactorUserGuard,
} from './jwt.strategy'

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly twoFactorService: TwoFactorService,
  ) {}

  @Put('/2fa')
  @UseGuards(JwtBeforeTwoFactorUserGuard)
  async enable(@Req() req: any) {
    const { uid } = req.user

    return {
      qr: await this.twoFactorService.enable(uid),
    }
  }

  @Delete('/2fa')
  @UseGuards(JwtAfterTwoFactorUserGuard)
  async disable(@Req() req: any) {
    const { uid } = req.user

    await this.twoFactorService.disable(uid)
  }

  @Get('/2fa')
  @UseGuards(JwtBeforeTwoFactorUserGuard)
  async verify(@Req() req: any, @Query('token') token: string) {
    const { uid } = req.user

    const verified = await this.twoFactorService.verify(uid, token)

    if (verified) {
      const user = await this.userService.findOneByUid(uid)

      return {
        access_token: this.userService.issueToken(user, true),
      }
    } else {
      throw new UnauthorizedException()
    }
  }
}
