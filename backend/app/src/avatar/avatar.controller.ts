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
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtFtGuard } from 'auth/ft/jwt-ft.strategy'
import { multerOptions } from './avatar.options'
import { Response } from 'express'

@Controller('api/avatar')
export class AvatarController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', multerOptions('/srv/uploads/avatar')),
  )
  @Bind(UploadedFile())
  @UseGuards(JwtFtGuard)
  async upload(@UploadedFile() file: any) {
    return file.filename
  }

  @Get(':uuid')
  async get(@Res() res: Response, @Param('uuid') uuid: string) {
    res.download(`/srv/uploads/avatar/${uuid}`, uuid)
  }
}
