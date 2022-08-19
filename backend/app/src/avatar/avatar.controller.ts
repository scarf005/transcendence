import {
  Controller,
  Post,
  UseInterceptors,
  Bind,
  UploadedFile,
  UseGuards,
  Get,
  Res,
  Param,
  BadRequestException,
  Req,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtFtGuard } from 'auth/ft/jwt-ft.strategy'
import { multerOptions } from './avatar.options'
import { Response } from 'express'
import { FileNameDto } from 'dto/fileName.dto'
import { JwtAfterTwoFactorUserGuard } from 'auth/jwt.strategy'
import { UserService } from 'user/user.service'
import { ApiTags, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger'

@Controller('api/avatar')
@ApiTags('아바타 API')
export class AvatarController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @UseGuards(JwtFtGuard)
  @UseInterceptors(
    FileInterceptor('file', multerOptions('/srv/uploads/avatar')),
  )
  @Bind(UploadedFile())
  @ApiOperation({
    summary: '아바타 등록 API',
    description: '필드 "file": filename',
  })
  @ApiCreatedResponse({ description: 'filename', type: String })
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException()
    }
    return { filename: file.filename }
  }

  @Post('/change')
  @UseInterceptors(
    FileInterceptor('file', multerOptions(process.env.AVATAR_SAVE)),
  )
  @Bind(UploadedFile())
  @UseGuards(JwtAfterTwoFactorUserGuard)
  @ApiOperation({
    summary: '아바타 수정 API',
    description: `필드 "file": filename`,
  })
  @ApiCreatedResponse({ description: 'filename', type: String })
  async change(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file) {
      throw new BadRequestException('file does not exist')
    }
    const { uid } = req.user
    return this.userService.changeAvatar(file, uid)
  }

  @Get(':filename')
  @UseGuards(JwtFtGuard)
  @ApiOperation({
    summary: '아바타 이미지 다운로드 API',
    description: `param: filename`,
  })
  @ApiCreatedResponse({ description: 'file', type: String })
  async get(@Res() res: Response, @Param() param: FileNameDto) {
    res.download(`${process.env.AVATAR_SAVE}/${param.filename}`, param.filename)
  }
}
