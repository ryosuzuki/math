import React, { Component } from 'react'
import { Group, Rect, Path, Line, Circle } from 'react-konva'
import { parseSync, stringify } from 'svgson'
import { pathParse, serializePath } from 'svg-path-parse'
import svgPathBbox from 'svg-path-bbox'

import Graph from './Graph.js'

class Figures extends Component {
  constructor(props) {
    super(props)
    window.Figure = this
    this.state = {
      currentId: -1,
      lines: [],
      figures: [],
      segments: [],
    }
    this.equations = [
      'y = \\sqrt{x} - 2',
      'y = \\sqrt{x - 2}',
      'y = - \\sqrt{x}',
      'y = \\sqrt{-x}',
      'y = \\sqrt{x}',
      'y = 2 \\sqrt{x}',
      'y = x^2',
      'y = (x + 3)^2 + 1',
      'y = \\sin(x)',
      'y = \\sin(2x)',
    ]

    this.ratios = [
      { x: 25.66064861813475, y: 26.905709982731338 }, // 0
      { x: 29.245847176079735, y: 29.669850016473006}, // 1
      { x: 25.66064861813475, y: 26.905709982731338 }, // 2 x
      { x: 29.245847176079735, y: 29.669850016473006}, // 3 x
      { x: 25.66064861813475, y: 26.905709982731338 }, // 4 x
      { x: 29.245847176079735, y: 29.669850016473006}, // 5 x
      { x: 29.245847176079735, y: 29.669850016473006}, // 6 x
      { x: 25.9444824525229, y: 28.036916408186016},   // 7
      { x: 25.9444824525229, y: 28.036916408186016},   // 8 x
      { x: 25.9444824525229, y: 28.036916408186016},   // 9 x
    ]
  }

  componentDidMount() {
    this.processLine()
    this.processContour()
  }

  async fetchData(url) {
    try {
      const response = await fetch(url)
      return response.text()
    } catch (error) {
      console.error(error);
    }
  }

  async processLine() {
    const url = `${App.domain}/public/sample/figure-line-${App.sampleId}.svg`
    let svgText = await this.fetchData(url)
    let svgJson = parseSync(svgText)
    let lines = svgJson.children
    lines = lines.filter((line) => line.attributes.d)
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i]
      let bbox = svgPathBbox(line.attributes.d)
      line.bbox = bbox
      line.visible = false
      lines[i] = line
    }
    this.setState({ lines: lines })
  }

  async processContour() {
    const url = `${App.domain}/public/sample/figure-contour-${App.sampleId}.svg`
    let svgText = await this.fetchData(url)
    let svgJson = parseSync(svgText)
    let contours = svgJson.children
    contours = contours.filter((contour) => contour.attributes.d)
    let figures = []
    for (let i = 0; i < contours.length; i++) {
      let path = contours[i]
      let bbox = svgPathBbox(path.attributes.d)
      let width = bbox[2] - bbox[0]
      let height = bbox[3] - bbox[1]
      if (width < 100 || height < 100) continue
      if (width > 1000 && height > 1000) continue
      let figure = { bbox: bbox}
      figure = this.getAxis(figure)
      if (figure) {
        figures.push(figure)
      }
      // break
    }
    this.setState({ figures: figures })
  }

  getAxis(figure) {
    let lines = this.state.lines
    let currentLines = lines.filter((line) => {
      return (line.bbox[0] > figure.bbox[0]
           && line.bbox[1] > figure.bbox[1]
           && line.bbox[2] < figure.bbox[2]
           && line.bbox[3] < figure.bbox[3])
    })
    // currentLines.map((line) => line.visible = true )
    let horizontal = []
    let vertical = []
    let graphs = []
    let threshold = 5
    for (let line of currentLines) {
      let bbox = line.bbox
      if (Math.abs(bbox[1] - bbox[3]) < threshold) {
        horizontal.push(bbox)
      } else if (Math.abs(bbox[0] - bbox[2]) < threshold) {
        vertical.push(bbox)
      } else {
        graphs.push(line)
      }
    }
    let xAxis = this.getAxisPoints(horizontal, 'x')
    let yAxis = this.getAxisPoints(vertical, 'y')
    let segments = this.getSegments(graphs)
    if (xAxis && yAxis) {
      figure.xAxis = xAxis
      figure.yAxis = yAxis
      figure.origin = { x: yAxis[0], y: xAxis[1] }
      figure.visible = false
      figure.graphs = graphs
      figure.segments = segments
      figure.graphRef = React.createRef()
      return figure
    } else {
      return null
    }
  }

  getAxisPoints(bboxes, axis='x') {
    let xs = _.flatten(bboxes.map(bbox => [bbox[0], bbox[2]]))
    let ys = _.flatten(bboxes.map(bbox => [bbox[1], bbox[3]]))
    let minX = _.min(xs)
    let maxX = _.max(xs)
    let minY = _.min(ys)
    let maxY = _.max(ys)
    let midX = (minX + maxX) / 2
    let midY = (minY + maxY) / 2
    if (isNaN(minX) || isNaN(maxX) || isNaN(minY) || isNaN(maxY)) return null
    if (axis === 'x') {
      return [minX, midY, maxX, midY]
    } else {
      return [midX, minY, midX, maxY]
    }
  }

  getSegments(graphs) {
    let segments = []
    for (let graph of graphs) {
      let path = graph.attributes.d
      let pathData = pathParse(path).getSegments()
      segments.push(pathData.segments)
    }
    segments = _.flatten(segments)
    return segments
  }

  onMouseDown(i) {
    let figure = this.state.figures[i]
    // figure.visible = true
  }

  onMouseEnter(i) {
    console.log(i)
    if (!this.props.selectMode) return
    this.setState({ currentId: i })
  }

  onMouseLeave(i) {
    if (!this.props.selectMode) return
    this.setState({ currentId: -1 })
  }

  render() {
    return (
      <>
        { this.state.figures.map((figure, i) => {
          let stroke = 'rgba(0, 0, 0, 0)'
          let fill = 'rgba(0, 0, 0, 0)'
          if (this.state.currentId === i) {
            stroke = App.strokeColor
            fill = App.fillColorAlpha
          }
          return (
            <Group key={i}>
              <Rect
                key={ `bounding-box-${i}` }
                x={ figure.bbox[0] }
                y={ figure.bbox[1] }
                width={ figure.bbox[2] - figure.bbox[0] }
                height={ figure.bbox[3] - figure.bbox[1] }
                strokeWidth={ 3 }
                stroke={ stroke }
                fill={ fill }
                onMouseDown={ this.onMouseDown.bind(this, i) }
                onMouseEnter={ this.onMouseEnter.bind(this, i) }
                onMouseLeave={ this.onMouseLeave.bind(this, i) }
              />
              {/* x-axis */}
              <Line
                key={ `x-axis-${i}` }
                x={ 0 }
                y={ 0 }
                points={ figure.xAxis }
                strokeWidth={ 8 }
                stroke={ 'red' }
                visible={ figure.visible }
              />
              {/* y-axis */}
              <Line
                key={ `y-axis-${i}` }
                x={ 0 }
                y={ 0 }
                points={ figure.yAxis }
                strokeWidth={ 8 }
                stroke={ 'red' }
                visible={ figure.visible }
              />
              {/* origin */}
              <Circle
                key={ `origin-${i}` }
                x={ figure.origin.x }
                y={ figure.origin.y }
                radius={ 10 }
                fill={ 'red' }
                visible={ figure.visible }
              />

              <Graph
                ref={ figure.graphRef }
                origin={ figure.origin }
                xAxis={ figure.xAxis }
                yAxis={ figure.yAxis }
                equation={ this.equations[i] }
                ratio={ this.ratios[i] }
                segments={ figure.segments }
                graphs={ figure.graphs }
              />

              {/* segments for debugging */}
              { figure.segments.map((segment, j) => {
                return (
                  <Circle
                    key={ `segment-${i}-${j}` }
                    x={ segment[1] }
                    y={ segment[2] }
                    radius={ 3 }
                    fill={ 'red' }
                    visible={ false }
                  />
                )
              })}

              {/* graph path for debugging */}
              { figure.graphs.map((graph, j) => {
                return (
                  <Path
                    key={ `graph-${i}-${j}` }
                    data={ graph.attributes.d }
                    strokeWidth={ 8 }
                    stroke={ 'green' }
                    visible={ false }
                  />
                )
              })}
            </Group>
          )
        })}
      </>
    )
  }
}

export default Figures