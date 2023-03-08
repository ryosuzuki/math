import fs from 'fs'
import ImageTracer from  'imagetracerjs'
import jpeg from 'jpeg-js'

const infilepath = __dirname + '/' + 'filter-1.jpg';
const outfilepath = __dirname + '/' + 'filter-1.svg';

try {
  const jpgdata = fs.readFileSync(infilepath);
  const pixels = jpeg.decode(jpgdata);
  const myImageData = { width: pixels.width, height: pixels.height, data: pixels.data };
  const options = { scale: 5 };
  const svgstring = ImageTracer.imagedataToSVG(myImageData, options);

  fs.writeFileSync(outfilepath, svgstring);
  console.log(outfilepath + ' was saved!');
} catch (err) {
  console.log(err);
  throw err;
}
