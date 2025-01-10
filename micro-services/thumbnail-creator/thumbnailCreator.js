import cote from 'cote'

const responder = new cote.Responder({ name: 'thumbnail-creator' })

responder.on('product-image-added', (event, callback) => {
  // creo el thumbnail a partir de la imagen
  const thumbnail = 'TODO'

  callback(thumbnail)
})
