import React, { Component } from 'react'
import { Line } from 'react-konva'
import { parse, compile } from 'mathjs'
import { parseTex, evaluateTex } from 'tex-math-parser'

class Graph extends Component {
  constructor(props) {
    super(props)
    window.Graph = this
    this.state = {
      equation: 'x^2',
      points: [],
      origin: { x: 0, y: 0 },
      ratio: { x: 0, y: 0 },
      graphBounding: { minX: 0, maxX: 0, minY: 0, maxY: 0 },
      axisBounding: { minX: 0, maxX: 0, minY: 0, maxY: 0 },
    }
    /*
      y=x^{2}+6 x+10=(x+3)^{2}+1
    */
    // this.state.equation = '(x+3)^{2}+1'
    let equation = 'y = x^2'
    let origin = { x: 659, y: 947 }
    let graphBounding = { minX: 597, maxX: 723, minY: 790, maxY: 947 }
    let axisBounding = { minX: 538, maxX: 785, minY: 781, maxY: 986 }

    origin = { x: 1029, y: 949 }
    axisBounding = { minX: 849, maxX: 1085, minY: 781, maxY: 986 }
    graphBounding = { minX: 895, maxX: 1009, minY: 792, maxY: 924 }
    // equation = 'y = (x+3)^{2}+1'

    this.state.origin = origin
    this.state.graphBounding = graphBounding
    this.state.axisBounding = axisBounding
    this.state.equation = equation



  }

  componentDidMount() {
    this.init()

    setTimeout(() => {
      let p = { x: 953, y: 923 } // x: -3, y: 1
      let dx = p.x - this.state.origin.x // = -3
      let dy = p.y - this.state.origin.y // = 1
      let ratio = { x: dx / (-3) , y: dy / 1 }
      this.setState({ ratio: ratio })
      this.update('y = (x+3)^{2}+1')
    }, 10)
  }

  init() {
    let points = []
    for (let x = -3; x < 3; x += 0.01) {
      let answer = evaluateTex(this.state.equation, { x: x });
      let y = answer.evaluated
      points.push({ x: x, y: y })
    }
    let graphBounding = this.state.graphBounding
    let xs = points.map(point => point.x)
    let ys = points.map(point => point.y)
    let bounding = { minX: _.min(xs), maxX: _.max(xs), minY: _.min(ys), maxY: _.max(ys) }
    let xRatio = (graphBounding.maxX - graphBounding.minX) / (bounding.maxX - bounding.minX)
    let yRatio = - (graphBounding.maxY - graphBounding.minY) / (bounding.maxY - bounding.minY)
    let ratio = { x: xRatio, y: yRatio }
    this.setState({ graphBounding: graphBounding, ratio: ratio, points: points })
  }

  update(equation) {
    try {
      let points = []
      for (let x = -10; x < 10; x += 0.01) {
        let answer = evaluateTex(equation, { x: x });
        let y = answer.evaluated
        points.push({ x: x, y: y })
      }
      this.setState({ equation: equation, points: points })
    } catch (err) {
      console.error(err)
    }
  }

  convert(points) {
    let offset = 50
    let linePoints = []
    for (let point of points) {
      let x = point.x * this.state.ratio.x + this.state.origin.x
      let y = point.y * this.state.ratio.y + this.state.origin.y
      if (isNaN(x) || isNaN(y)) continue
      if (x < this.state.axisBounding.minX - offset || this.state.axisBounding.maxX + offset < x) continue
      if (y < this.state.axisBounding.minY - offset || this.state.axisBounding.maxY + offset < y) continue
      linePoints.push(x, y)
    }
    return linePoints
  }


  render() {
    return (
      <>
        <Line
          x={ 0 }
          y={ 0 }
          points={ this.convert(this.state.points) }
          stroke={ App.strokeColor }
          strokeWidth={ 4 }
          draggable
        />
      </>
    )
  }
}

export default Graph