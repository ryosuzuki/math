import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line, Group, Circle, Path, Image, Shape} from 'react-konva'
import Konva from 'konva'

import MathCircle from './MathCircle.js'
import MathSine from './MathSine.js'
import MathText from './MathText.js'
import DrawingLine from './DrawingLine.js'
import Words from './Words.js'

import ocr from './sample/ocr-2.json'

let debug = false

class Canvas extends Component {
  constructor(props) {
    super(props)
    window.Canvas = this
    window.canvas = this
    window.Konva = Konva
    this.state = {
      currentId: -1,
      event: {},
      paperImage: null,
      textAnnotations: [],
      selectMode: true
    }
    this.drawingLineRef = React.createRef()
  }

  componentDidMount() {
    let paperImage = document.getElementById('paper')
    this.setState({ paperImage: paperImage })
    this.stage = Konva.stages[0]

    window.ocr = ocr
    const rawtext = ocr.textAnnotations[0].description
    const text = rawtext.replace(/(\r\n|\n|\r)/gm, " ")

    let words = ['h', 'k', 'r']
    console.log(words)
    let textAnnotations = ocr.textAnnotations.filter((textAnnotation) => {
      return words.includes(textAnnotation.description)
    })
    console.log(textAnnotations)
    this.setState({ textAnnotations: textAnnotations })
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
    this.setState({ event: event })
    this.drawingLineRef.current.mouseDown()
  }

  stageMouseMove(event) {
    // console.log(this.state)
    this.setState({ event: event })
    this.drawingLineRef.current.mouseMove()
  }

  stageMouseUp(event) {
    // console.log(event)
    this.setState({ event: event })
    this.drawingLineRef.current.mouseUp()
  }

  render() {
    return (
      <>
        <div id="buttons">
          <button id="select" onClick={ () => this.setState({ selectMode: !this.state.selectMode }) }>{ `Select Mode: ${this.state.selectMode}` }</button>
        </div>

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
                fill={ 'rgba(255, 255, 0, 0.1)' }
              />

              {/* Paper Image */}
              <Image image={ this.state.paperImage } />

              {/* Paper Outline */}

              {/* Graph */}
              <Image image={this.state.mafsImage} />

              {/* Summary */}
              <MathCircle />

              <Words
                selectMode={ this.state.selectMode }
              />
              {/*<MathSine />*/}

              {/* Drawing Line */}
              <DrawingLine ref={this.drawingLineRef} />
            </Layer>
          </Stage>
        </div>
      </>
    )
  }
}

export default Canvas