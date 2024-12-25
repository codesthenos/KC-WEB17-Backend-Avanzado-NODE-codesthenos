import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'
import { Product } from '../models/Product.js'

export const jwtMiddleware = (req, res, next) => {
  try {
    const jwToken = req.get('Authorization') || req.query.jwt || req.body.jwt

    if (!jwToken) {
      return next(createHttpError(401, 'No token provided'))
    }

    const decoded = jwt.verify(jwToken, process.env.JWT_SECRET)

    req.apiUserId = decoded.id
    if (!req.apiUserId) {
      return next(createHttpError(401, 'invalid token'))
    }
    next()
  } catch (error) {
    if (error.message === 'invalid signature') {
      return next(createHttpError(401, 'invalid token'))
    }
    next(error)
  }
}

export const verifyOwner = async (req, res, next) => {
  const productId = req.params.id
  const userId = req.apiUserId

  if (!productId) {
    return next(createHttpError(404, 'id not provided'))
  }

  if (!userId) {
    return next(createHttpError(401, 'invalid token'))
  }

  const product = await Product.findById(productId)

  if (!product) {
    return next(createHttpError(404, 'product not found'))
  }

  if (product.owner.toString() !== userId) {
    return next(createHttpError(401, 'user not allowed'))
  }

  next()
}
