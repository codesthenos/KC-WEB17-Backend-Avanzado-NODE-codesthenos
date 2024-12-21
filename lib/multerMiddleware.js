import path from 'node:path'
import multer from 'multer'

const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

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

const fileFilter = (req, file, callback) => {
  if (imageTypes.includes(file.mimetype)) {
    callback(null, true)
  } else {
    req.fileValidationError = true
    callback(null, false)
  }
}

const limits = { fileSize: 1024 * 1024 * 5 }

export const uploadFileMiddleware = multer({ storage, fileFilter, limits }).single('image')
