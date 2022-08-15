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
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtFtGuard } from 'auth/ft/jwt-ft.strategy'
import { multerOptions } from './avatar.options'
import { Response } from 'express'
import { JwtAfterTwoFactorUserGuard } from 'auth/jwt.strategy'
import { FileNameDto } from 'dto/fileName.dto'

@Controller('api/avatar')
export class AvatarController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', multerOptions('/srv/uploads/avatar')),
  )
  @Bind(UploadedFile())
  @UseGuards(JwtFtGuard)
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException()
    }
    return { filename: file.filename }
  }

  @Get(':filename')
  @UseGuards(JwtAfterTwoFactorUserGuard)
  async get(@Res() res: Response, @Param() param: FileNameDto) {
    res.download(`/srv/uploads/avatar/${param.filename}`, param.filename)
  }
}
