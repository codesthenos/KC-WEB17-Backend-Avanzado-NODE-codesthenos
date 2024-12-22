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

    req.apiUserId = decoded._id
    next()
  } catch (error) {
    next(error)
  }
}

export const verifyOwner = async (req, res, next) => {
  const productId = req.params.id
  const userId = req.apiUserId

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
