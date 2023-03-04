import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line, Group, Circle, Path, Image } from 'react-konva'
import Konva from 'konva'
import useImage from 'use-image'
// import ocr from './sample/ocr.json'
// import summary from './sample/summary.json'
// import visualize from './sample/visualize.json'

window.Konva = Konva
let debug = false

const LionImage = () => {
  const [image] = useImage('http://localhost:4000/public/sample.jpg');
  return <Image x={ 30 } y={ 300 } width={ 1200 } height={ 1200 } image={image} />;
};

class Canvas extends Component {
  constructor(props) {
    super(props)
    window.Canvas = this
    window.canvas = this
    this.state = {
      image: null
    }
  }

  componentDidMount() {
    this.socket = App.socket

    let img = document.getElementById('cat')
    this.setState({ image: img })
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
              {/*<LionImage />*/}
              <Image width={ 900 } height={ 1200 } image={ this.state.image } />
              {/* Paper Outline */}

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