import React, { Component } from 'react'
import { Stage, Layer, Group, Rect, Image } from 'react-konva'
import Konva from 'konva'

import DrawingLine from './DrawingLine.js'
import Words from './Words.js'
import Figures from './Figures.js'
import Equations from './Equations.js'
import Graph from './Graph.js'
import Slider from './Slider.js'
import Triangle from './Triangle-2.js'
import Summation from './Summation.js'

class Canvas extends Component {
  constructor(props) {
    super(props)
    window.Canvas = this
    window.canvas = this
    window.Konva = Konva
    this.state = {
      event: {},
      paperImage: null,
      currentSymbols: {},
      currentGraphs: [],
      clickedFigureId: -1,
      clickedEquationId: -1,
    }
    this.symbolHash = {}

    this.equationRefs = []
    this.graphRefs = []
    this.xGraphRefs = []
    this.yGraphRefs = []
    this.drawingLineRef = React.createRef()
  }

  componentDidMount() {
    let paperImage = document.getElementById('paper')
    this.setState({ paperImage: paperImage })
    this.stage = Konva.stages[0]
  }

  addGraph(hash) {
    if (this.state.clickedEquationId === hash.clickedEquationId) {
      this.setState({ clickedEquationId: -1 })
      return
    }
    if (this.state.clickedFigureId === hash.clickedFigureId) {
      this.setState({ clickedFigureId: -1 })
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
          console.log(this.graphRefs)
          currentGraphs = _.uniqWith(currentGraphs, _.isEqual)
          console.log({ currentGraphs: currentGraphs })
          this.setState(
            {
              currentGraphs: currentGraphs,
              clickedEquationId: -1,
              clickedFigureId: -1,
            },
            () => {
              this.updateValue({})
            }
          )
        }
      })
    })
  }

  updateValue(newSymbols, round = 1) {
    let currentSymbols = this.state.currentSymbols
    for (let tag of Object.keys(newSymbols)) {
      currentSymbols[tag] = _.round(newSymbols[tag], round)
    }
    this.setState({ currentSymbols: currentSymbols })
    const asciiSymbols = {}
    for (let tag of Object.keys(currentSymbols)) {
      let ascii = this.convertAscii(tag)
      asciiSymbols[ascii] = currentSymbols[tag]
    }
    const figureIds = _.uniq(this.state.currentGraphs.map(g => g.figureId))

    for (let i = 0; i < this.xGraphRefs.length; i++) {
      if (!figureIds.includes(i)) continue
      if (!asciiSymbols['x']) continue
      const graph = this.xGraphRefs[i].current
      let latex = `x = ${asciiSymbols['x']}`
      graph.update(latex)
    }
    for (let i = 0; i < this.xGraphRefs.length; i++) {
      if (!figureIds.includes(i)) continue
      if (!asciiSymbols['y']) continue
      const graph = this.yGraphRefs[i].current
      let latex = `y = ${asciiSymbols['y']}`
      graph.update(latex)
    }
    for (let graphRef of this.graphRefs) {
      const graph = graphRef.current
      let latex = _.clone(graph.latex)
      delete asciiSymbols['x']
      delete asciiSymbols['y']
      latex = latex.replace(/\\sqrt/g, '\\SQRT')
      if (Object.keys(asciiSymbols).length > 0) {
        const pattern = new RegExp(Object.keys(asciiSymbols).join('|'), 'g')
        latex = latex.replace(pattern, match => asciiSymbols[match])
      }
      latex = latex.replace(/\\SQRT/g, '\\sqrt')
      graph.update(latex)
    }
  }

  convertAscii(tag) {
    let codes = tag.split('-').map((a) => parseInt(a, 16))
    let ascii = codes
      .map((code) => {
        let offset = 0
        if (119886 <= code && code <= 119911) {
          offset = 119789; // math italic lower
        }
        if (119860 <= code && code <= 119885) {
          offset = 119795; // math italic upper
        }
        code = code - offset
        return String.fromCharCode(code)
      })
      .join('')
    if (ascii === 'ℎ') ascii = 'h'
    return ascii
  }

  mouseDown(pos) {
    console.log(App.state.mouse)
    let event = new MouseEvent('mousedown', {
      clientX: pos.x,
      clientY: pos.y,
      pageX: pos.x,
      pageY: pos.y,
    })
    this.stage._pointerdown(event)
  }

  mouseMove(pos) {
    let event = new MouseEvent('mousemove', {
      clientX: pos.x,
      clientY: pos.y,
      pageX: pos.x,
      pageY: pos.y,
    })
    this.stage._pointermove(event)
  }

  mouseDrag(pos) {
    let event = new MouseEvent('mousemove', {
      clientX: pos.x,
      clientY: pos.y,
      pageX: pos.x,
      pageY: pos.y,
    })
    Konva.DD._drag(event)
  }

  mouseUp(pos) {
    let event = new MouseEvent('mouseup', {
      clientX: pos.x,
      clientY: pos.y,
      pageX: pos.x,
      pageY: pos.y,
    })
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

  updateSymbols = (new_symbols) => {
    this.setState({ currentSymbols: new_symbols })
  }

  render() {
    return (
      <>
        <div style={{ display: 'none' }}>
          <Stage
            width={App.size}
            height={App.size}
            onMouseDown={this.stageMouseDown.bind(this)}
            onMouseMove={this.stageMouseMove.bind(this)}
            onMouseUp={this.stageMouseUp.bind(this)}
          >
            <Layer ref={(ref) => (this.layer = ref)}>
              {/* Canvas Background */}
              <Rect
                x={0}
                y={0}
                width={App.size}
                height={App.size}
                fill={'rgba(255, 255, 0, 0.1)'}
              />

              {/* Paper Image */}
              <Image image={this.state.paperImage} />

              {/* Words > Variable */}
              <Words />

              {/* Figures > Axis + [Graph1, Graph2, ...] */}
              <Figures />

              {/* Equations > Equation > Symbol */}
              <Equations />

              { this.state.currentGraphs.map((graph, i) => {
                const equationId = graph.equationId
                const equation = window.Equations.state.equations[equationId]
                return (
                  <Graph
                    key={ `graph-${i}` }
                    ref={ this.graphRefs[i] }
                    figureId={ graph.figureId }
                    equationId={ graph.equationId }
                  />
                )
              })}

              {/* Slider */}
              <Slider />

              {/* Drawing Line */}
              <DrawingLine ref={this.drawingLineRef} />

              {/* Summation component, works for any pdf with summation that has 'n', the pdf needs an ocr.json */}
              { App.sampleId === 9 &&
                <Summation currentSymbols={this.state.currentSymbols} />
              }

              {/* Triangle component, only works for sample-10.pdf */}
              { App.sampleId === 10 &&
                <Triangle
                  onTriangleChange={this.updateSymbols}
                  currentSymbols={this.state.currentSymbols}
                />
              }


            </Layer>
          </Stage>
        </div>
      </>
    )
  }
}

export default Canvas
