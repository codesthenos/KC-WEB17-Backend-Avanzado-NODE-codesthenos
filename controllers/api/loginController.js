import createHttpError from 'http-errors'
import { User } from '../../models/User.js'
import jwt from 'jsonwebtoken'

export const apiloginController = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user || !(await user.comparePassword(password))) {
      return next(createHttpError(401, 'Invalid credentials'))
    }

    const jwToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    })
    res.json({ jwToken })
  } catch (error) {
    next(error)
  }
}
