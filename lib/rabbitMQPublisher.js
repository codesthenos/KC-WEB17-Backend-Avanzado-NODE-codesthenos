import amqplib from 'amqplib'

const EXCHANGE_NAME = 'new-image-added'

const connection = await amqplib.connect(process.env.RABBITMQ_BROKER_URL)

const channel = await connection.createChannel()

await channel.assertExchange(EXCHANGE_NAME, 'direct')

export const newImageAdded = async ({ image }) => {
  const message = {
    image
  }

  const isBufferFull = !channel.publish(EXCHANGE_NAME, '*', Buffer.from(JSON.stringify(message)))

  if (isBufferFull) {
    await new Promise(resolve => channel.on('drain', resolve))
  }
}
