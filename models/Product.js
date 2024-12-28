import { Schema, model } from 'mongoose'

const productSchema = new Schema({
  name: { type: String, unique: true },
  price: { type: Number, min: 0, index: true },
  image: String,
  tags: { type: [String], index: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', index: true }
}, { timestamps: true })

// static method for listing products
productSchema.statics.list = ({ filters = {}, options = {} }) => {
  return Product.find(filters)
    // collation to make insensitive the sorting by name
    .collation({ locale: 'en', strength: 2 })
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.limit)
    .select(options.fields)
    .exec()
}

export const Product = model('Product', productSchema)
