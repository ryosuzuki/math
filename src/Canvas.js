import React, { Component } from 'react'
import { Stage, Layer, Rect, Image } from 'react-konva'
import Konva from 'konva'

import DrawingLine from './DrawingLine.js'
import Words from './Words.js'
import Figures from './Figures.js'
import Equations from './Equations.js'
import Graph from './Graph.js'
import Slider from './Slider.js'

let debug = false

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
      currentGraphs: [],
      clickedFigureId: -1,
      clickedEquationId: -1,
    }
    this.symbolHash = {}
    if (debug) {
      this.state.selectMode = false
      // this.state.currentSymbols = { '31': 1, '33': 3 }
      this.state.currentSymbols = {'210E': 0, '1D458': 0, '1D45F': 2}

      setTimeout(() => {
        // const graph = this.graphRefs[7].current
        // const equation = this.equationRefs[10].current

        const graph = this.graphRefs[0].current
        const equation = this.equationRefs[2].current

        graph.setState({ equation: equation })
        graph.update(equation.props.latex)
      }, 500)
    }

    this.equationRefs = []
    this.graphRefs = []

    this.figuresRef = React.createRef()
    this.equationsRef = React.createRef()
    this.drawingLineRef = React.createRef()
  }

  componentDidMount() {
    let paperImage = document.getElementById('paper')
    this.setState({ paperImage: paperImage })
    this.stage = Konva.stages[0]
  }

  addGraph(hash) {
    if (this.state.clickedEquationId === hash.clickedEquationId) {
      this.setState({ clickedEquationId: - 1})
      return
    }
    if (this.state.clickedFigureId === hash.clickedFigureId) {
      this.setState({ clickedFigureId: - 1})
      return
    }
    let equationId = this.state.clickedEquationId
    let figureId = this.state.clickedFigureId
    if (hash.clickedEquationId >= 0) equationId = hash.clickedEquationId
    if (hash.clickedFigureId >= 0) figureId = hash.clickedFigureId

    this.setState({ clickedEquationId: equationId }, () => {
      this.setState({ clickedFigureId: figureId }, () => {
        const equationId = this.state.clickedEquationId
        const figureId = this.state.clickedFigureId
        console.log(equationId, figureId)
        if (equationId >= 0 && figureId >= 0) {
          let currentGraphs = this.state.currentGraphs
          const graph = { figureId: figureId, equationId: equationId }
          currentGraphs.push(graph)
          const graphRef = React.createRef()
          this.graphRefs.push(graphRef)
          currentGraphs = _.uniqWith(currentGraphs, _.isEqual)
          console.log({ currentGraphs: currentGraphs })
          this.setState({ currentGraphs: currentGraphs, clickedEquationId: -1, clickedFigureId: -1 })
        }
      })
    })
  }

  updateValue(newSymbols, round=1) {
    let currentSymbols = this.state.currentSymbols
    for (let tag of Object.keys(newSymbols)) {
      currentSymbols[tag] = _.round(newSymbols[tag], round)
    }
    this.setState({ currentSymbols: currentSymbols })

    for (let graphRef of this.graphRefs) {
      const graph = graphRef.current
      // const equation = graph.props.latex
      // if (!equation) continue
      let latex = _.clone(graph.props.latex)
      console.log(latex)
      // console.log(latex) // latex = 'y=(x+3)^{2}+1'
      latex = latex.replace(/\\sqrt/g, '\\SQRT')
      // const pattern = new RegExp(Object.keys(currentSymbols).map(s => '\\u{' + s + '}').join('|'), 'gu');
      // latex = latex.replace(pattern, match => currentSymbols[match.codePointAt(0).toString(16).toUpperCase()]);
      const asciiSymbols = {}
      for (let tag of Object.keys(currentSymbols)) {
        const ascii = this.convertAscii(tag)
        asciiSymbols[ascii] = currentSymbols[tag]
      }
      const pattern = new RegExp(Object.keys(asciiSymbols).join('|'), 'gu');
      latex = latex.replace(pattern, match => asciiSymbols[match]);
      latex = latex.replace(/\\SQRT/g, '\\sqrt')

      // latex = `x = ${asciiSymbols['r']}`
      // console.log(pattern)
      // console.log(latex) // latex = 'y=(x+{a})^{b}+{c}'
      graph.update(latex)
    }
  }

  convertAscii(tag) {
    let codes = tag.split('-').map(a => parseInt(a, 16));
    let ascii = codes.map(code => {
      let offset = 0
      if (119886 <= code && code <= 119911) {
        offset = 119789 // math italic lower
      }
      if (119860 <= code && code <= 119885) {
        offset = 119795 // math italic upper
      }
      code = code - offset
      return String.fromCharCode(code);
    }).join('')
    if (ascii === 'ℎ') ascii = 'h'
    return ascii
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

              {/* Words > Variable */}
              <Words />

              {/* Figures > Axis + [Graph1, Graph2, ...] */}
              <Figures
                ref={ this.figuresRef }
              />

              {/* Equations > Equation > Symbol */}
              <Equations
                ref={ this.equationsRef }
              />

              { this.state.currentGraphs.map((graph, i) => {
                const figureId = graph.figureId
                const equationId = graph.equationId
                const figures = this.figuresRef.current.state.figures
                const equations = this.equationsRef.current.state.equations
                const figure = figures[figureId]
                const equation = equations[equationId]
                return (
                  <Graph
                    id={ i }
                    ref={ this.graphRefs[i] }
                    figureId={ figureId }
                    equationId={ equationId }
                    origin={ figure.origin }
                    xAxis={ figure.xAxis }
                    yAxis={ figure.yAxis }
                    originalSegments={ figure.originalSegments }
                    latex={ equation.latex }
                  />
                )
              })}

              {/* Slider */}
              <Slider />

              {/* Drawing Line */}
              <DrawingLine
                ref={ this.drawingLineRef }
              />

            </Layer>
          </Stage>
        </div>
      </>
    )
  }
}

export default Canvas