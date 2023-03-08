import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line, Group, Circle, Path, Image, Shape} from 'react-konva'
import Konva from 'konva'

import MathCircle from './MathCircle.js'
import MathSine from './MathSine.js'
import Variable from './Variable.js'
import DrawingLine from './DrawingLine.js'
import Words from './Words.js'
import Graph from './Graph.js'

import { pathParse, serializePath } from 'svg-path-parse'
import { parse, stringify } from 'svgson'
import svgPathBbox from 'svg-path-bbox'
import svg from '!raw-loader!!./sample-1.svg'
import { svgPathProperties } from 'svg-path-properties'

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
      currentSymbols: { },
      paths: [],
      bbox: { minX: 0, minY: 0, maxX: 0, maxY: 0 }
    }
    if (debug) {
      this.state.selectMode = false
      this.state.currentSymbols = { h: 10, k: 10, r: 30 }
    }

    this.drawingLineRef = React.createRef()
    this.graphRef = React.createRef()
  }

  componentDidMount() {
    let paperImage = document.getElementById('paper')
    this.setState({ paperImage: paperImage })
    this.stage = Konva.stages[0]

    // console.log(svg)
    window.svg = svg
    parse(svg).then((json) => {
      console.log(JSON.stringify(json, null, 2))
      window.json = json

      let paths = []
      let bounding = { minX: 830, maxX: 1123, minY: 777, maxY: 984 }
      for (let i = 0; i < json.children.length; i++) {
        let path = json.children[i]
        let d = path.attributes.d
        // let bbox = svgPathBbox(d)
        // path.bbox = bbox
        // let rect = {
        //   x: bbox[0],
        //   y: bbox[1],
        //   width: bbox[2] - bbox[0],
        //   height: bbox[3] - bbox[1]
        // }
        // path.rect = rect
        // let properties = new svgPathProperties(d)
        // path.length = properties.getTotalLength()

        // if (path.length > 3000) continue
        // if (path.length < 100) continue

        json.children[i] = path
        // if (bounding.minX < bbox[0] && bbox[2] < bounding.maxX && bounding.minY < bbox[1] && bbox[3] < bounding.maxY) {
          paths.push(path)
        // }
      }

      // let minX = _.min(paths.map((path) => path.bbox[0]))
      // let minY = _.min(paths.map((path) => path.bbox[1]))
      // let maxX = _.max(paths.map((path) => path.bbox[2]))
      // let maxY = _.max(paths.map((path) => path.bbox[3]))
      // let bbox = { minX: minX, minY: minY, maxX: maxX, maxY: maxY }

      console.log(this)
      this.setState({ paths: paths })

      // this.graphRef.current.setState({ axisBounding: bbox })
    })

    // window.pathDatas = pathParse('./test.svg').getSegments()
    // serializePath(pathDatas)



  }

  updateValue(hash, round=1) {
    let currentSymbols = this.state.currentSymbols
    for (let key of Object.keys(hash)) {
      currentSymbols[key] = _.round(hash[key], round)
    }
    this.setState({ currentSymbols: currentSymbols })
    this.graphRef.current.updateValue()
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
              {/*<Image image={ this.state.paperImage } />*/}

              {/* Circle */}
              <MathCircle />

              <Graph ref={this.graphRef} />

              {/* Words */}
              <Words
                selectMode={ this.state.selectMode }
              />

              <Rect
                x={ this.state.bbox.minX }
                y={ this.state.bbox.minY }
                width={ this.state.bbox.maxX - this.state.bbox.minX }
                height={ this.state.bbox.maxY - this.state.bbox.minY }
                strokeWidth={ App.strokeWidth }
                stroke={ App.highlightColor }
              />

              { this.state.paths.map((path, i) => {
                return (
                  <Path
                    data={ path.attributes.d }
                    stroke={ App.highlightColor }
                    strokeWidth={ 3 }
                  />
                  /*
                  <Rect
                    x={ path.rect.x }
                    y={ path.rect.y }
                    width={ path.rect.width }
                    height={ path.rect.height }
                    strokeWidth={ App.strokeWidth }
                    stroke={ App.strokeColor }
                  />
                  */
                )
              })}

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