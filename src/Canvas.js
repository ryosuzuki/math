import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line, Group, Circle, Path, Image, Shape} from 'react-konva'
import Konva from 'konva'

window.Konva = Konva
let debug = false

class Canvas extends Component {
  constructor(props) {
    super(props)
    window.Canvas = this
    window.canvas = this
    this.state = {
      paperImage: null,
      mafsImage: null,
    }

  }

  componentDidMount() {
    this.socket = App.socket

    let paperImage = document.getElementById('paper')
    this.setState({ paperImage: paperImage })

    setInterval(() => {
      this.load()
    }, 1000)
  }

  load() {
    let svgElement = document.querySelector('.MafsView svg')
    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(svgElement)
    const mafsImage = new window.Image()
    mafsImage.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
    mafsImage.onload = () => {
      this.setState({ mafsImage: mafsImage })
    }
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
              {/* Paper Image */}
              <Image image={ this.state.paperImage } />

              {/* Paper Outline */}

              {/* Graph */}
              <Image image={this.state.mafsImage} />

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