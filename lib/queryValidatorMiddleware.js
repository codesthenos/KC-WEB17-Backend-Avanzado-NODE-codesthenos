import { validateQueryLimitSkip, validateQueryPrice, validateQuerySort, validateQueryTag } from './config.js'

export const queryValidatorMiddleware = (req, res, next) => {
  const { limit, skip, sort, tag, price } = req.query

  if (limit || skip) validateQueryLimitSkip(limit, skip) // validate if these can be numbers
  if (sort) validateQuerySort(sort) // <name> | <name-1> | <price> | <price-1>
  if (tag) validateQueryTag(tag) // <motor> | <mobile> | <lifestyle> | <work>
  if (price) validateQueryPrice(price) // <exactNumber> | <minNumber-> | <-maxNumber> | <minNumber-maxNumber>

  next()
}
