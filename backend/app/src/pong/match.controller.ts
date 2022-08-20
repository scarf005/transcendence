import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { JwtAfterTwoFactorUserGuard } from 'auth/jwt.strategy'
import { ApiTags, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger'
import { MatchService } from './match.service'
import { Match } from './match.entity'
import { UidDto } from 'dto/uid.dto'

@Controller('api/match')
@ApiTags('match API')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  @UseGuards(JwtAfterTwoFactorUserGuard)
  @ApiOperation({
    summary: 'Get All match history API',
  })
  @ApiCreatedResponse({ description: 'Match', type: Match, isArray: true })
  findAllMatch(): Promise<Match[]> {
    return this.matchService.findAll()
  }

  @Get(':uid')
  @UseGuards(JwtAfterTwoFactorUserGuard)
  @ApiOperation({
    summary: 'Get User match history API',
    description: 'param으로 targetUid를 받아서 유저의 경기 기록을 반환한다.',
  })
  @ApiCreatedResponse({ description: 'Match', type: Match, isArray: true })
  findMatchByUid(@Param() param: UidDto): Promise<Match[]> {
    return this.matchService.findMatchByUid(+param.uid)
  }
}
