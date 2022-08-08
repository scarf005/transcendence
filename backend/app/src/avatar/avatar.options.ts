import * as multer from 'multer'
import * as path from 'path'
import * as fs from 'fs'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import { v4 as uuidv4 } from 'uuid'
import { BadRequestException } from '@nestjs/common'

const MEGA_BYTES = 1000 * 1000

const storage = (folder: string): multer.StorageEngine => {
  fs.mkdirSync(folder, { recursive: true })

  return multer.diskStorage({
    destination(req, file, cb) {
      cb(null, folder)
    },

    filename(req, file, cb) {
      const ext = path.extname(file.originalname)

      cb(null, `${uuidv4()}${ext}`)
    },
  })
}

export const multerOptions = (folder: string) => {
  const result: MulterOptions = {
    storage: storage(folder),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        cb(null, true)
      } else {
        cb(new BadRequestException(), false)
      }
    },
    limits: {
      fileSize: 8 * MEGA_BYTES,
    },
  }

  return result
}
