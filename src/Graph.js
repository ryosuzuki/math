import React, { Component } from 'react'
import { Line } from 'react-konva'

class Graph extends Component {
  constructor(props) {
    super(props)
    window.Graph = this
    this.state = {
      points: [],
      origin: { x: 0, y: 0 },
      ratio: { x: 0, y: 0 },
      graphBounding: { minX: 0, maxX: 0, minY: 0, maxY: 0 },
      axisBounding: { minX: 0, maxX: 0, minY: 0, maxY: 0 },
    }
  }

  componentDidMount() {
    this.init()
  }

  init() {
    let points = []
    for (let x = -3; x < 3; x += 0.01) {
      let y = (x)**2
      points.push(x, y)
    }
    let origin = { x: 659, y: 947 }
    let graphBounding = { minX: 597, maxX: 723, minY: 790, maxY: 947 }
    let axisBounding = { minX: 538, maxX: 785, minY: 781, maxY: 986 }
    let xs = points.filter((el, i) => i % 2 === 0)
    let ys = points.filter((el, i) => i % 2 === 1)
    let bounding = { minX: _.min(xs), maxX: _.max(xs), minY: _.min(ys), maxY: _.max(ys) }
    let xRatio = (graphBounding.maxX - graphBounding.minX) / (bounding.maxX - bounding.minX)
    console.log(xRatio)
    let yRatio = - (graphBounding.maxY - graphBounding.minY) / (bounding.maxY - bounding.minY)
    console.log(xRatio, yRatio)
    let ratio = { x: xRatio, y: yRatio }
    this.setState({ origin: origin, graphBounding: graphBounding, axisBounding: axisBounding, ratio: ratio, points: points })
  }

  convert(points) {
    points = points.map((el, i) => {
      if (i % 2 === 0) return el * this.state.ratio.x + this.state.origin.x
      if (i % 2 === 1) return el * this.state.ratio.y + this.state.origin.y
    })
    return points
    // let offset = 0
    // if (x < xAxis.start - offset || xAxis.end + offset < x) return
    // if (y < yAxis.end - offset || yAxis.start + offset < y) return
    // return { x: x, y: y }
  }


  render() {
    return (
      <>
        <Line
          x={ 0 }
          y={ 0 }
          points={ this.state.points.map((el, i) => {
            if (i % 2 === 0) return el * this.state.ratio.x + this.state.origin.x
            if (i % 2 === 1) return el * this.state.ratio.y + this.state.origin.y
          }) }
          stroke={ App.strokeColor }
          strokeWidth={ 4 }
          draggable
        />
      </>
    )
  }
}

export default Graph