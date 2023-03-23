
import React, { Component } from 'react'
import { Line, Text } from 'react-konva'
import { parseTex, evaluateTex } from 'tex-math-parser'
import * as math from 'mathjs';

class Graph extends Component {
  constructor(props) {
    super(props)
    window.Graph = this
    this.state = {
      points: [],
    }
  }

  componentDidMount() {
    this.update(this.props.equation)
  }

  update(equation) {
    try {
      let points = []
      for (let x = -10; x < 10; x += 0.05) {
        let answer = evaluateTex(equation, { x: x });
        let y = answer.evaluated
        points.push({ x: x, y: y })
      }
      this.setState({ points: points })
    } catch (err) {
      console.error(err)
    }
  }

  onDragStart(event) {
    const target = event.target
    this.originPos = App.state.mouse
    this.originSymbols = _.clone(Canvas.state.currentSymbols)
  }

  onDragMove(event) {
    const target = event.target
    target.x(0)
    target.y(0)
    let pos = App.state.mouse
    let delta = { x: pos.x - this.originPos.x, y: pos.y - this.originPos.y }
    let a = this.originSymbols['33']
    let b = this.originSymbols['31']
    let hash = {}
    if (!isNaN(a)) {
      hash['33'] = a - delta.x / this.props.ratio.x
    }
    if (!isNaN(b)) {
      hash['31'] = b - delta.y / this.props.ratio.y
    }
    let round = 1
    Canvas.updateValue(hash, round)
  }

  onDragEnd(event) {
  }

  convert(points) {
    let offset = 50
    let linePoints = []
    for (let point of points) {
      let x = point.x * this.props.ratio.x + this.props.origin.x
      let y = point.y * -this.props.ratio.y + this.props.origin.y
      if (isNaN(x) || isNaN(y)) continue
      if (x < this.props.xAxis[0] - offset || this.props.xAxis[2] + offset < x) continue
      if (y < this.props.yAxis[1] - offset || this.props.xAxis[3] + offset < y) continue
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
          onDragStart={this.onDragStart.bind(this) }
          onDragMove={this.onDragMove.bind(this) }
          onDragEnd={this.onDragEnd.bind(this) }
        />
      </>
    )
  }
}

export default Graph