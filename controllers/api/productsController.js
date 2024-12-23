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
    // change this for a validation middleware

    if (name) {
      filters.name = name
    }

    if (price) {
      filters.price = parseFloat(price)
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
      sort,
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
      tags,
      image,
      owner: userId
    })

    const newProduct = await product.save()

    res.status(201).json({ result: newProduct })
  } catch (error) {
    next(error)
  }
}

export const apiProductController = async (req, res, next) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)
    if (!product) {
      return res.status(404).json({ error: 'not found' })
    } else {
      res.json(product)
    }
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
