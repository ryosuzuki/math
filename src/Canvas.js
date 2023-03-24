import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line, Group, Circle, Path, Image, Shape} from 'react-konva'
import Konva from 'konva'
import { Html } from 'react-konva-utils';
import unidecode from 'unidecode'
import tr from 'transliteration';

import Variable from './Variable.js'
import DrawingLine from './DrawingLine.js'
import Words from './Words.js'
import Graphs from './Graphs.js'
import Equations from './Equations.js'

let debug = false

class Canvas extends Component {
  constructor(props) {
    super(props)
    window.Canvas = this
    window.canvas = this
    window.Konva = Konva
    window.unidecode = unidecode
    window.transliterate = tr
    this.state = {
      event: {},
      paperImage: null,
      selectMode: true,
      currentSymbols: {},
      currentGraph: null,
    }
    this.symbols = {}
    this.symbolHash = {}
    if (debug) {
      this.state.selectMode = false
      this.state.currentSymbols = { '31': 1, '33': 3 }

      setTimeout(() => {
        const graph = this.graphRefs[7].current
        const equation = this.equationRefs[7].current
        graph.setState({ equation: equation })
        graph.update(equation.props.latex)
      }, 300)
    }

    this.equationRefs = []
    this.graphRefs = []

    this.drawingLineRef = React.createRef()
    this.graphsRef = React.createRef()
  }

  componentDidMount() {
    let paperImage = document.getElementById('paper')
    this.setState({ paperImage: paperImage })
    this.stage = Konva.stages[0]
  }

  updateValue(newSymbols, round=1) {
    let currentSymbols = this.state.currentSymbols
    for (let tag of Object.keys(newSymbols)) {
      currentSymbols[tag] = _.round(newSymbols[tag], round)
    }
    this.setState({ currentSymbols: currentSymbols })

    for (let graphRef of this.graphRefs) {
      const graph = graphRef.current
      const equation = graph.state.equation
      if (!equation) continue

      let latex = _.clone(equation.props.latex)
      console.log(latex) // latex = 'y=(x+3)^{2}+1'
      const pattern = new RegExp(Object.keys(currentSymbols).map(s => '\\u{' + s + '}').join('|'), 'gu');
      latex = latex.replace(pattern, match => currentSymbols[match.codePointAt(0).toString(16).toUpperCase()]);
      console.log(latex) // latex = 'y=(x+{a})^{b}+{c}'
      graph.update(latex)
    }

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

              {/* Words */}
              <Words />

              <Graphs
                ref={this.graphsRef}
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