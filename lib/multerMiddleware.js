import path from 'node:path'
import multer from 'multer'

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const storagePath = path.join(import.meta.dirname, '..', 'public', 'productsImages')
    callback(null, storagePath)
  },
  filename: (req, file, callback) => {
    const filename = `${file.fieldname}-${Date.now()}-${file.originalname}`
    callback(null, filename)
  }
})

export const uploadFileMiddleware = multer({ storage }).single('image')
