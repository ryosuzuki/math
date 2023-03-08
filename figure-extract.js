import fs from 'fs'
import ImageTracer from  'imagetracerjs'
import jpeg from 'jpeg-js'

let sampleIds = [1, 2, 3, 4, 5, 6, 7]

for (let sampleId of sampleIds) {
  const file = `public/sample/figure-${sampleId}.jpg`
  const out = `public/sample/figure-contour-${sampleId}.svg`

  const image = fs.readFileSync(file)
  const pixels = jpeg.decode(image)
  const imageData = { width: pixels.width, height: pixels.height, data: pixels.data }
  const options = { scale: 1 }
  const svg = ImageTracer.imagedataToSVG(imageData, options)

  fs.writeFileSync(out, svg)
  console.log(out + ' was saved')
}