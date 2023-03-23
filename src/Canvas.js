import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line, Group, Circle, Path, Image, Shape} from 'react-konva'
import Konva from 'konva'
import { Html } from 'react-konva-utils';

import Variable from './Variable.js'
import DrawingLine from './DrawingLine.js'
import Words from './Words.js'
import Graph from './Graph.js'
import Figures from './Figures.js'
import Equations from './Equations.js'

let debug = true

class Canvas extends Component {
  constructor(props) {
    super(props)
    window.Canvas = this
    window.canvas = this
    window.Konva = Konva
    this.state = {
      event: {},
      paperImage: null,
      selectMode: true,
      currentSymbols: {},
    }
    this.symbols = {}
    if (debug) {
      this.state.selectMode = false
      this.state.currentSymbols = { '31': 1, '33': 3 }
    }

    this.drawingLineRef = React.createRef()
    this.graphRef = React.createRef()
    this.figuresRef = React.createRef()
  }

  componentDidMount() {
    let paperImage = document.getElementById('paper')
    this.setState({ paperImage: paperImage })
    this.stage = Konva.stages[0]
  }

  updateValue(hash, round=1) {
    let currentSymbols = this.state.currentSymbols
    for (let key of Object.keys(hash)) {
      currentSymbols[key] = _.round(hash[key], round)
    }
    this.setState({ currentSymbols: currentSymbols })

    const figures = this.figuresRef.current.state.figures
    let a = -currentSymbols['33']
    let b = currentSymbols['31']
    let equation = `y = (x - ${a})^{${2}} + ${b}`
    figures[7].graphRef.current.update(equation)
  }

  mouseDown(pos) {
    console.log(App.state.mouse)
    let event = new MouseEvent('mousedown' , { clientX: pos.x, clientY: pos.y, pageX: pos.x, pageY: pos.y })
    this.stage._pointerdown(event)
  }

  mouseMove(pos) {
    let event = new MouseEvent('mousemove' , { clientX: pos.x, clientY: pos.y, pageX: pos.x, pageY: pos.y })
    this.stage._pointermove(event)
  }

  mouseDrag(pos) {
    let event = new MouseEvent('mousemove' , { clientX: pos.x, clientY: pos.y, pageX: pos.x, pageY: pos.y })
    Konva.DD._drag(event)
  }

  mouseUp(pos) {
    let event = new MouseEvent('mouseup' , { clientX: pos.x, clientY: pos.y, pageX: pos.x, pageY: pos.y })
    Konva.DD._endDragBefore(event)
    this.stage._pointerup(event)
    Konva.DD._endDragAfter(event)
  }

  stageMouseDown(event) {
    this.setState({ event: event })
    this.drawingLineRef.current.mouseDown()
  }

  stageMouseMove(event) {
    this.setState({ event: event })
    this.drawingLineRef.current.mouseMove()
  }

  stageMouseUp(event) {
    this.setState({ event: event })
    this.drawingLineRef.current.mouseUp()
  }

  render() {
    return (
      <>
        <div id="buttons">
          <button id="select" onClick={ () => this.setState({ selectMode: !this.state.selectMode }) }>{ `Select Mode: ${this.state.selectMode}` }</button>
        </div>

        <div style={{ display: 'none' }}>
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
                fill={ 'rgba(255, 255, 0, 0.1)' }
              />

              {/* Paper Image */}
              <Image image={ this.state.paperImage } />

              {/*<Graph ref={this.graphRef} />*/}

              {/* Words */}
              <Words
                selectMode={ this.state.selectMode }
              />

              <Figures
                ref={this.figuresRef}
                selectMode={ this.state.selectMode }
              />
              {/* Drawing Line */}
              <DrawingLine ref={this.drawingLineRef} />

              <Equations />
            </Layer>
          </Stage>
        </div>
      </>
    )
  }
}

export default Canvas