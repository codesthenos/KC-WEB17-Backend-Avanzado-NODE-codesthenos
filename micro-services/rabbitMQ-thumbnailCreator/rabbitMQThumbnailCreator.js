import 'dotenv/config'
import path from 'node:path'
import ampqlib from 'amqplib'
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

// rabbitMQ config
const QUEUE_NAME = 'thumbnail-creator'

const connection = await ampqlib.connect(process.env.RABBITMQ_BROKER_URL)

const channel = await connection.createChannel()

channel.assertQueue(QUEUE_NAME)

const messageInParallel = 1

channel.prefetch(messageInParallel)

channel.consume(QUEUE_NAME, async message => {
  const { image } = JSON.parse(message.content.toString())

  const inputPath = path.join(import.meta.dirname, '..', '..', 'public', image)
  const outputPath = path.join(import.meta.dirname, '..', '..', 'public', 'thumbnails', image)

  await createThumbnail({ inputPath, outputPath, width: RESIZE_MEASURES.WIDTH, height: RESIZE_MEASURES.HEIGHT })

  channel.ack(message)
})
