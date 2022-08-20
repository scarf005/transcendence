import {
  Controller,
  Put,
  UseGuards,
  Req,
  Delete,
  Get,
  Query,
  UnauthorizedException,
  Param,
} from '@nestjs/common'

import { TwoFactorService } from './two-factor.service'
import { UserService } from 'user/user.service'
import {
  JwtAfterTwoFactorUserGuard,
  JwtBeforeTwoFactorUserGuard,
} from './jwt.strategy'
import { VerifyTokenDto } from 'dto/verifyToken.dto'
import { ApiTags, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger'

@Controller('api/auth')
@ApiTags('AUTH API')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly twoFactorService: TwoFactorService,
  ) {}

  @Put('/2fa')
  @ApiOperation({
    summary: '2fa 생성과 qr 코드 생성 API',
    description:
      'token에 들어있는 uid를 사용해 해당 유저의 2fa를 사용할 수 있게 qr코드 생성',
  })
  @ApiCreatedResponse({
    description: 'qrcode',
    type: String,
  })
  @UseGuards(JwtBeforeTwoFactorUserGuard)
  async enable(@Req() req: any) {
    const { uid } = req.user

    return {
      qr: await this.twoFactorService.enable(uid),
    }
  }

  @Delete('/2fa')
  @ApiOperation({
    summary: '2fa 취소 API',
    description: 'token에 들어있는 uid를 사용해 해당 유저의 2fa를 취소',
  })
  @UseGuards(JwtAfterTwoFactorUserGuard)
  async disable(@Req() req: any) {
    const { uid } = req.user

    await this.twoFactorService.disable(uid)
  }

  @Get('/2fa')
  @ApiOperation({
    summary: '2fa 인증 API',
    description:
      'token에 들어있는 uid와 쿼리로 들어오는 2fa 토큰을 인증하여 인증 성공 여부를 반환',
  })
  @ApiCreatedResponse({
    description: 'ok : access_token, no : error',
    type: String,
  })
  @UseGuards(JwtBeforeTwoFactorUserGuard)
  async verify(@Req() req: any, @Query() query: VerifyTokenDto) {
    const { uid } = req.user

    const verified = await this.twoFactorService.verify(uid, query.token)

    if (verified) {
      const user = await this.userService.findOneByUid(uid)

      return {
        access_token: this.userService.issueToken(user, true),
      }
    } else {
      throw new UnauthorizedException()
    }
  }

  @Get('/test/:uid')
  @ApiOperation({
    summary: 'test 용 api',
    description: ' param으로 들어오는 uid의 access_token을 반환',
  })
  @ApiCreatedResponse({
    description: 'ok : access_token',
    type: String,
  })
  async test(@Param('uid') uid: number) {
    const user = await this.userService.findOneByUid(+uid)

    return {
      access_token: this.userService.issueToken(user, true),
    }
  }
}
