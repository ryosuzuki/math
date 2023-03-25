import React, { Component } from 'react'
import { Group, Rect, Path, Line, Circle } from 'react-konva'
import svgson from 'svgson'
import svgPathBbox from 'svg-path-bbox'
import parseSvg from 'parse-svg-path'

import Graph from './Graph.js'

class Graphs extends Component {
  constructor(props) {
    super(props)
    window.Graphs = this
    this.state = {
      currentId: -1,
      selectId: -1,
      lines: [],
      graphs: [],
      segments: [],
    }
    this.ratio = { x: 26, y: 28 }
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
    let svgJson = svgson.parseSync(svgText)
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
    let svgJson = svgson.parseSync(svgText)
    let contours = svgJson.children
    contours = contours.filter((contour) => contour.attributes.d)
    let graphs = []
    for (let i = 0; i < contours.length; i++) {
      let path = contours[i]
      let bbox = svgPathBbox(path.attributes.d)
      let width = bbox[2] - bbox[0]
      let height = bbox[3] - bbox[1]
      if (width < 100 || height < 100) continue
      if (width > 1000 && height > 1000) continue
      let graph = { bbox: bbox}
      graph = this.getAxis(graph)
      if (graph) {
        const graphRef = React.createRef()
        Canvas.graphRefs.push(graphRef)
        graphs.push(graph)
      }
      // break
    }
    this.setState({ graphs: graphs })
  }

  getAxis(graph) {
    let lines = this.state.lines
    let currentLines = lines.filter((line) => {
      return (line.bbox[0] > graph.bbox[0]
           && line.bbox[1] > graph.bbox[1]
           && line.bbox[2] < graph.bbox[2]
           && line.bbox[3] < graph.bbox[3])
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
      graph.xAxis = xAxis
      graph.yAxis = yAxis
      graph.origin = { x: yAxis[0], y: xAxis[1] }
      graph.visible = false
      graph.graphs = graphs
      graph.segments = segments
      return graph
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
      const path = graph.attributes.d
      // let pathData = pathParse(path).getSegments()
      // segments.push(pathData.segments)
      const pathSegments = parseSvg(path)
      segments.push(pathSegments)
    }
    segments = _.flatten(segments)
    return segments
  }

  onMouseDown(i) {
    if (!Canvas.state.selectMode) return
    if (this.state.selectId === i) {
      this.setState({ selectId: -1 })
    } else {
      this.setState({ selectId: i })
    }
  }

  onMouseEnter(i) {
    console.log(i)
    if (!Canvas.state.selectMode) return
    this.setState({ currentId: i })
  }

  onMouseLeave(i) {
    if (!Canvas.state.selectMode) return
    this.setState({ currentId: -1 })
  }

  render() {
    return (
      <>
        { this.state.graphs.map((graph, i) => {
          let stroke = 'rgba(0, 0, 0, 0)'
          let fill = 'rgba(0, 0, 0, 0)'
          if (this.state.currentId === i) {
            stroke = App.strokeColor
            fill = App.fillColorAlpha
          }
          if (this.state.selectId === i) {
            stroke = App.highlightColor
            fill = App.highlightColorAlpha
          }
          return (
            <Group key={i}>
              <Rect
                key={ `bounding-box-${i}` }
                x={ graph.bbox[0] }
                y={ graph.bbox[1] }
                width={ graph.bbox[2] - graph.bbox[0] }
                height={ graph.bbox[3] - graph.bbox[1] }
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
                points={ graph.xAxis }
                strokeWidth={ 8 }
                stroke={ 'red' }
                visible={ graph.visible }
              />
              {/* y-axis */}
              <Line
                key={ `y-axis-${i}` }
                x={ 0 }
                y={ 0 }
                points={ graph.yAxis }
                strokeWidth={ 8 }
                stroke={ 'red' }
                visible={ graph.visible }
              />
              {/* origin */}
              <Circle
                key={ `origin-${i}` }
                x={ graph.origin.x }
                y={ graph.origin.y }
                radius={ 10 }
                fill={ 'red' }
                visible={ graph.visible }
              />

              <Graph
                id={ i }
                ref={ Canvas.graphRefs[i] }
                origin={ graph.origin }
                xAxis={ graph.xAxis }
                yAxis={ graph.yAxis }
                ratio={ this.ratio }
                segments={ graph.segments }
                graphs={ graph.graphs }
              />

              {/* segments for debugging */}
              { graph.segments.map((segment, j) => {
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
              { graph.graphs.map((graph, j) => {
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

export default Graphs