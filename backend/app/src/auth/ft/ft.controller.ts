import { Body, Get, Put, Redirect, Req } from '@nestjs/common'
import { Controller } from '@nestjs/common'
import { UserService } from 'user/user.service'
import { FtOauthService } from './ft-oauth.service'
import { UseGuards } from '@nestjs/common'
import { FtGuard } from './ft.strategy'
import { JwtFtGuard } from './jwt-ft.strategy'
import { RegisterUserDto } from 'dto/registerUser.dto'

@Controller('api/auth/ft')
export class FtController {
  constructor(
    private readonly userService: UserService,
    private readonly ftOauthService: FtOauthService,
  ) {}

  @Get()
  @UseGuards(FtGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async auth() {}

  @Get('/callback')
  @UseGuards(FtGuard)
  @Redirect()
  async callback(@Req() req: any) {
    const { uid } = req.user

    const url = new URL('/login', process.env.BASE_URL)

    const ftUser =
      (await this.ftOauthService.findOne(uid)) ||
      (await this.ftOauthService.create(uid))

    if (ftUser.user) {
      url.searchParams.append(
        'access_token',
        this.userService.issueToken(ftUser.user, !ftUser.user.twoFactor),
      )
      if (ftUser.user.twoFactor) {
        url.searchParams.append('done', '0')
        url.searchParams.append('reason', 'twofactor')
      } else {
        url.searchParams.append('done', '1')
      }
    } else {
      url.searchParams.append(
        'access_token',
        this.ftOauthService.issueToken(ftUser),
      )
      url.searchParams.append('done', '0')
      url.searchParams.append('reason', 'register')
    }
    return {
      url: url.toString(),
      code: 302,
    }
  }

  @Put('/register')
  @UseGuards(JwtFtGuard)
  async register(@Req() req: any, @Body() body: RegisterUserDto) {
    const { uid } = req.user
    const user = await this.userService.create(body)
    const ftUser = await this.ftOauthService.findOne(uid)

    ftUser.user = user
    await this.ftOauthService.save(ftUser)

    return { access_token: this.userService.issueToken(user, !user.twoFactor) }
  }
}
