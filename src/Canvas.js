import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line, Group, Circle, Path, Image } from 'react-konva'
import Konva from 'konva'
// import ocr from './sample/ocr.json'
// import summary from './sample/summary.json'
// import visualize from './sample/visualize.json'

window.Konva = Konva
let debug = false

class Canvas extends Component {
  constructor(props) {
    super(props)
    window.Canvas = this
    window.canvas = this
    this.state = {
    }
  }

  componentDidMount() {
    this.socket = App.socket
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
                fill={ 'rgba(255, 255, 0, 0.3)' }
              />
              {/* Paper Outline */}

              {/* Summary */}

              {/* Drawing Line */}
              <Line
                points={ this.state.currentPoints }
                stroke={ App.strokeColor }
                strokeWidth={ App.strokeWidth }
              />
              <Circle
                x={ 300 }
                y={ 300 }
                radius={ 50 }
                strokeWidth={ App.strokeWidth }
                stroke={ App.strokeColor }
                fill={ App.fillColorAlpha }
                visible={ true }
                draggable
              />
            </Layer>
          </Stage>
        </div>
      </>
    )
  }
}

export default Canvas