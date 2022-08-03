import { Controller, Get, UseGuards, Req } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UserService } from 'src/user/user.service'

@Controller('api/auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Get('ft')
  @UseGuards(AuthGuard('ft'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async auth() {}

  @Get('ft/callback')
  @UseGuards(AuthGuard('ft'))
  async callback(@Req() req: any) {
    const { id, username } = req.user

    let user = await this.userService.findOne(id)
    if (!user) {
      user = await this.userService.create(id, username)
    }
    return this.userService.issueToken(user)
  }
}
