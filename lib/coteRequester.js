import cote from 'cote'

const requester = new cote.Requester({ name: 'codesthenos-nodepop' })

export const imageAddedEvent = ({ image }) => {
  const event = {
    type: 'product-image-added',
    image
  }
  requester.send(event, result => {
    console.log(result)
  })
}
