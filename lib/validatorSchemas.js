import { z } from 'zod'
import { handleProductValidationError } from './zodErrorHandlers.js'
import { CREATE_PRODUCT_TITLE, UPDATE_PRODUCT_TITLE } from './config.js'

export const loginSchema = z.object({
  email: z.string({
    required_error: 'Provide an email'
  }).email({
    required_error: 'Invalid email'
  }),
  password: z.string({
    required_error: 'Provide a password'
  }).min(6, {
    message: 'Password must be at least 6 characters'
  })
})

export const productSchema = z.object({
  name: z.string({
    required_error: 'Provide a product name'
  }),
  price: z.string().refine(value => !isNaN(parseFloat(value)), {
    message: 'Price must be a valid number'
  }).transform(value => parseFloat(value))
    .refine(value => value > 0, {
      message: 'Price must be greater than 0'
    }),
  image: z.instanceof(File).refine((file) => {
    // Ensure the file type matches
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/svg+xml']
    return validTypes.includes(file.type)
  }, {
    message: 'File must be a valid image format (e.g., .jpg, .png, .gif, etc.)'
  }).refine((file) => {
    // Limit the file size
    const maxSizeInBytes = 5 * 1024 * 1024 // 5MB
    return file.size <= maxSizeInBytes
  }, {
    message: 'File size must be 5MB or smaller'
  }),
  tags: z.array(z.string(), { required_error: 'Select at least one tag' })
})
// high order function middleware to handle validation in login, register users
export const validatorMiddleware = ({ title, schema, errorHandler }) => (req, res, next) => {
  try {
    schema.parse(req.body)
  } catch (error) {
    errorHandler(title, error, res, req.body.email)
    return
  }
  next()
}
// high order function middleware to handle validation in create and update products
export const validatorProductMiddleware = ({ title, schema, errorHandler }) => (req, res, next) => {
  try {
    const body = req.body
    const normalizedTags = typeof body.tags === 'string' ? [body.tags] : body.tags
    schema.parse({ ...body, tags: normalizedTags })
  } catch (error) {
    errorHandler(title, error, res, req.body.name, req.body.price, req.body.image, req.body.tags)
    return
  }
  next()
}
// validator createProduct middleware
export const createProductValidatorMiddleware = validatorProductMiddleware({ title: CREATE_PRODUCT_TITLE, schema: productSchema, errorHandler: handleProductValidationError })
// validator updateProduct middleware
export const updateProductValidatorMiddleware = validatorProductMiddleware({ title: UPDATE_PRODUCT_TITLE, schema: productSchema, errorHandler: handleProductValidationError })