import path from 'node:path'
import cote from 'cote'
import { Jimp } from 'jimp'

const createThumbnail = async ({ inputPath, outputPath, width, height }) => {
  try {
    const image = await Jimp.read(inputPath)

    image.resize({ w: width, h: height })

    await image.write(outputPath)
    console.log('Image resized succesfully, saved at:', outputPath)
    return { message: 'thumbnail created' }
  } catch (error) {
    console.error('Error resizing the image', error.message)
    return { error: 'Error creating the thumbnail' }
  }
}

const RESIZE_MEASURES = {
  WIDTH: 100,
  HEIGHT: 100
}

const responder = new cote.Responder({ name: 'thumbnail-creator' })

responder.on('product-image-added', async (event, callback) => {
  // creo el thumbnail a partir de la imagen
  const { image } = event
  const inputPath = path.join(import.meta.dirname, '..', '..', 'public', image)
  const outputPath = path.join(import.meta.dirname, '..', '..', 'public', 'thumbnails', image)

  const { message, error } = await createThumbnail({ inputPath, outputPath, width: RESIZE_MEASURES.WIDTH, height: RESIZE_MEASURES.HEIGHT })

  const result = message ?? error

  callback(result)
})
