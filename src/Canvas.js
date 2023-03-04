import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line, Group, Circle, Path, Image, Shape} from 'react-konva'
import Konva from 'konva'
// import Graph from './Graph.js'
import { Mafs, Coordinates } from "mafs";

window.Konva = Konva
let debug = true

const MySVG = () => {
  const drawCircle = (context) => {
    const svgString = '<svg><circle cx="50" cy="50" r="300" fill="red" /></svg>';
    const DOMURL = window.URL || window.webkitURL || window;
    const img = new window.Image();
    const svg = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = DOMURL.createObjectURL(svg);

    img.onload = () => {
      context.drawImage(img, 0, 0);
      DOMURL.revokeObjectURL(url);
    };

    img.src = url;
  };

  return <Shape sceneFunc={drawCircle} />;
};


class Canvas extends Component {
  constructor(props) {
    super(props)
    window.Canvas = this
    window.canvas = this
    this.state = {
      image: null,
      svg: null,
      svgShape: null
    }

  }

  componentDidMount() {
    this.socket = App.socket

    // let img = document.getElementById('paper')
    // let svg = document.querySelector('.MafsView svg')

    // this.setState({ image: img, svg: svg })

    // Konva.Image.fromURL('path/to/your/svg/file.svg#hoge', (image) => {
    //   // Set the image as the shape for rendering
    //   this.setState({ svgShape: image });
    // });

    // const svgElement = document.getElementById('hoge');

    setInterval(() => {
      this.load()
    }, 1000)
  }

  load() {
    let svgElement = document.querySelector('.MafsView svg')
    // Create a new XMLSerializer to serialize the SVG element
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    // Create a new Image object
    const img = new window.Image();
    // img.src = `data:image/svg+xml;utf8,${svgString}`;
    img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;

    // img2.src = `data:image/svg+xml;utf8,${svgString}`;
    // Set the image as the shape for rendering
    img.onload = () => {
      this.setState({ image: img });
    };

  }

  render() {
    return (
      <>
        <div style={{ display: debug ? 'block' : 'none' }}>
          <Stage
            width={ App.size }
            height={ App.size }
          >
            <Layer ref={ ref => (this.layer = ref) }>
              {/* Canvas Background */}
              <Rect
                x={ 0 }
                y={ 0 }
                width={ App.size }
                height={ App.size }
                fill={ 'rgba(255, 255, 0, 0)' }
              />
              {/*<Paper Image />*/}
              <Image image={ this.state.image } />
              {/* Paper Outline */}

              {/*<Image image={ this.state.svg } />*/}

              <Shape image={this.state.svg} />

              {/*<Graph />*/}

              {/* Summary */}

              {/* Drawing Line */}
              <Line
                points={ this.state.currentPoints }
                stroke={ App.strokeColor }
                strokeWidth={ App.strokeWidth }
              />
              <Circle
                x={ 400 }
                y={ 500 }
                radius={ 50 }
                strokeWidth={ App.strokeWidth }
                stroke={ App.strokeColor }
                fill={ App.fillColorAlpha }
                visible={ true }
              />
            </Layer>
          </Stage>
        </div>
      </>
    )
  }
}

export default Canvas