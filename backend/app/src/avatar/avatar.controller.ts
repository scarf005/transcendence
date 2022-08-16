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

@Controller('api/avatar')
export class AvatarController {
  constructor(private readonly userService: UserService) {}
  @Post()
  // @UseGuards(JwtFtGuard)
  @UseInterceptors(
    FileInterceptor('file', multerOptions('/srv/uploads/avatar')),
  )
  @Bind(UploadedFile())
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
  async change(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file) {
      throw new BadRequestException('file does not exist')
    }
    const { uid } = req.user
    return this.userService.changeAvatar(file, uid)
  }

  @Get(':filename')
  // @UseGuards(JwtFtGuard)
  async get(@Res() res: Response, @Param() param: FileNameDto) {
    res.download(`${process.env.AVATAR_SAVE}/${param.filename}`, param.filename)
  }
}
