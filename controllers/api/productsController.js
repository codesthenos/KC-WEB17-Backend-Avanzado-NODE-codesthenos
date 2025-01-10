import { normalizePriceMongo, normalizeSortMongo } from '../../lib/config.js'
import { imageAddedEvent } from '../../lib/coteRequester.js'
import { Product } from '../../models/Product.js'

export const apiProductsController = async (req, res, next) => {
  try {
    const {
      name,
      price,
      tags,
      limit,
      skip,
      sort,
      fields
    } = req.query

    const userId = req.apiUserId

    const filters = {}

    if (name) {
      filters.name = new RegExp(`^${name}`, 'i')
    }

    if (price) {
      filters.price = normalizePriceMongo(price)
    }

    if (tags) {
      filters.tags = tags
    }

    if (userId) {
      filters.owner = userId
    }
    const options = {
      limit,
      skip,
      sort: normalizeSortMongo(sort),
      fields
    }
    const [products, productsCount] = await Promise.all([
      Product.list({ filters, options }),
      Product.countDocuments(filters)
    ])
    res.json({ products, productsCount })
  } catch (error) {
    next(error)
  }
}

export const apiCreateProductController = async (req, res, next) => {
  try {
    const { name, price, tags } = req.body
    const userId = req.apiUserId
    const image = req.file ? `/productsImages/${req.file.filename}` : '/productsImages/placeholder.jpg'

    const product = new Product({
      name,
      price: parseFloat(price),
      tags: typeof tags === 'string' ? [tags] : tags,
      image,
      owner: userId
    })

    const newProduct = await product.save()

    // microservice to create a thumbnail
    imageAddedEvent({ image: image.slice(1) })

    res.status(201).json({ result: newProduct })
  } catch (error) {
    next(error)
  }
}

export const apiProductController = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!id) {
      res.status(404).json({ error: 'id not provided' })
      return
    }

    const product = await Product.findById(id)

    if (!product) {
      res.status(404).json({ error: 'product not found' })
      return
    }

    res.json({ result: product })
  } catch (error) {
    next(error)
  }
}

export const apiUpdateProductController = async (req, res, next) => {
  try {
    const { id } = req.params
    const body = req.body

    const productData = {}

    if (body.name) {
      productData.name = body.name
    }

    if (body.price) {
      productData.price = parseFloat(body.price)
    }

    if (body.tags) {
      productData.tags = typeof body.tags === 'string' ? [body.tags] : body.tags
    }

    productData.image = req.file && `/productsImages/${req.file.filename}`

    const product = await Product.findByIdAndUpdate(id, productData, { new: true })

    // microservice to create a thumbnail only if there is a new image
    if (req.file) imageAddedEvent({ image: productData.image.slice(1) })

    res.json({ result: product })
  } catch (error) {
    next(error)
  }
}

export const apiDeleteProductController = async (req, res, next) => {
  try {
    const { id } = req.params

    await Product.findByIdAndDelete(id)

    res.json({ result: 'product deleted' })
  } catch (error) {
    next(error)
  }
}
