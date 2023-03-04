import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line, Group, Circle, Path, Image, Shape} from 'react-konva'
import Konva from 'konva'

import MathCircle from './MathCircle.js'
import MathSine from './MathSine.js'

window.Konva = Konva
let debug = false

class Canvas extends Component {
  constructor(props) {
    super(props)
    window.Canvas = this
    window.canvas = this
    this.state = {
      isPaint: false,
      currentPoints: [],
      currentPaths: [],
      currentId: -1,
      event: {},
      paperImage: null,
    }
  }

  componentDidMount() {
    this.socket = App.socket

    let paperImage = document.getElementById('paper')
    this.setState({ paperImage: paperImage })
    this.stage = Konva.stages[0]
  }

  mouseDown(pos) {
    let event = new MouseEvent('mousedown' , { clientX: pos.x, clientY: pos.y, pageX: pos.x, pageY: pos.y })
    this.stage._pointerdown(event)
  }

  mouseMove(pos) {
    let event = new MouseEvent('mousedown' , { clientX: pos.x, clientY: pos.y, pageX: pos.x, pageY: pos.y })
    this.stage._pointermove(event)
    Konva.DD._drag(event)
  }

  mouseUp(pos) {
    let event = new MouseEvent('mousedown' , { clientX: pos.x, clientY: pos.y, pageX: pos.x, pageY: pos.y })
    Konva.DD._endDragBefore(event)
    this.stage._pointerup(event)
    Konva.DD._endDragAfter(event)
  }

  stageMouseDown(event) {
    console.log(event)
    this.setState({ event: event })
    // if (event.target !== this.stage) return
    let pos = this.stage.getPointerPosition()
    this.setState({ isPaint: true, currentPoints: [pos.x, pos.y, pos.x, pos.y] })
  }

  stageMouseMove(event) {
    // console.log(this.state)
    this.setState({ event: event })
    let pos = this.stage.getPointerPosition()
    if (!this.state.isPaint) return false
    let points = this.state.currentPoints
    if (points[points.length-2] === pos.x && points[points.length-1] === pos.y) return false
    points = points.concat([pos.x, pos.y])
    this.setState({ currentPoints: points })
  }

  stageMouseUp(event) {
    // console.log(event)
    this.setState({ event: event })
    let pos = this.stage.getPointerPosition()
    if (!this.state.isPaint) return false
    this.setState({ isPaint: false })
    if (this.state.currentPoints.length === 0) return false
  }

  render() {

    return (
      <>
        <div style={{ display: debug ? 'block' : 'none' }}>
          <Stage
            width={ App.size }
            height={ App.size }
            onMouseDown={ this.stageMouseDown.bind(this) }
            onMouseMove={ this.stageMouseMove.bind(this) }
            onMouseUp={ this.stageMouseUp.bind(this) }
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
              <MathCircle />

              <MathSine />

              {/* Drawing Line */}
              <Line
                points={ this.state.currentPoints }
                stroke={ App.strokeColor }
                strokeWidth={ App.strokeWidth }
              />
            </Layer>
          </Stage>
        </div>
      </>
    )
  }
}

export default Canvas