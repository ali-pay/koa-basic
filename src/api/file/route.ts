import koaMulter from '@koa/multer'
import KoaRouter from '@koa/router'
import koaJwt from '@middleware/koa-jwt'
import dayjs from 'dayjs'
import { DATE_FORMAT } from '@util/constant'
import { create_file, delete_file, remove_file, search_file, update_file, upload_file } from './service'

const storage = koaMulter.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => cb(null, `${dayjs().format(DATE_FORMAT.NUMBER)}_${file.originalname}`),
})

// 文件最大10M
const upload = koaMulter({ storage, limits: { fileSize: 1000 * 1000 * 10 } })

export const router = new KoaRouter({ prefix: '/file' })

router.post('/search_file', search_file)

router.post('/create_file', koaJwt(['*']), create_file)

router.post('/update_file', koaJwt(['*']), update_file)

router.post('/delete_file', koaJwt(['*']), delete_file)

router.post('/remove_file', koaJwt(['*']), remove_file)

router.post('/upload_file', koaJwt(['*']), upload.array('files'), upload_file)
