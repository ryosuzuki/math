import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line, Group, Circle, Path, Image } from 'react-konva'
import Konva from 'konva'
// import Graph from './Graph.js'
import { Mafs, Coordinates } from "mafs";

window.Konva = Konva
let debug = false

class Canvas extends Component {
  constructor(props) {
    super(props)
    window.Canvas = this
    window.canvas = this
    this.state = {
      image: null,
      svg: null,
    }

  }

  componentDidMount() {
    this.socket = App.socket

    let img = document.getElementById('paper')
    let svg = document.getElementById('svg')
    this.setState({ image: img, svg: svg })
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

              <Image image={ this.state.svg } />


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