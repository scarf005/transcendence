import {
  Controller,
  Get,
  UseGuards,
  Query,
  Req,
  Redirect,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UserService } from 'src/user/user.service'

@Controller('api/auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Get('ft')
  @UseGuards(AuthGuard('ft'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async auth() {}

  @Get('create')
  async createUser(@Query() query: any) {
    const user = await this.userService.create(
      Math.floor(Math.random() * 10000).toString(),
      query.username,
    )
    return this.userService.issueToken(user)
  }

  @Get('ft/callback')
  @UseGuards(AuthGuard('ft'))
  @Redirect()
  async callback(@Req() req: any) {
    const { id, username } = req.user

    let user = await this.userService.findOne(id)
    if (!user) {
      user = await this.userService.create(id, username)
    }
    return {
      url: `/login?access_token=${await this.userService.issueToken(user)}`,
      code: 302,
    }
  }
}
