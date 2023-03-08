import React, { Component } from 'react'
import { Line, Text } from 'react-konva'
import { parseTex, evaluateTex } from 'tex-math-parser'

class Graph extends Component {
  constructor(props) {
    super(props)
    window.Graph = this
    this.state = {
      equation: 'x^2',
      points: [],
      ratio: { x: 0, y: 0 },
      variables: { a: -3, b: 1 }
    }
  }

  componentDidMount() {
    // this.init()
    // origin = { x: 1029, y: 949 }
    let p = { x: 953, y: 923 } // x: -3, y: 1
    let dx = p.x - this.props.origin.x // = -3
    let dy = p.y - this.props.origin.y // = 1
    dx = 953 - 1029
    dy = 923 - 949
    let ratio = { x: dx / (-3) , y: dy / 1 }
    this.setState({ ratio: ratio })
    this.update('y = (x+3)^{2}+1')
  }

  onDragStart(event) {
    const target = event.target
    this.originPos = App.state.mouse
    this.originSybmols = _.clone(Canvas.state.currentSymbols)
  }

  onDragMove(event) {
    const target = event.target
    target.x(0)
    target.y(0)
    let pos = App.state.mouse
    let delta = { x: pos.x - this.originPos.x, y: pos.y - this.originPos.y }
    let a = this.originSybmols['3']
    let b = this.originSybmols['1']
    let hash = {}
    if (!isNaN(a)) {
      hash['3'] = a - delta.x / this.state.ratio.x
    }
    if (!isNaN(b)) {
      hash['1'] = b + delta.y / this.state.ratio.y
    }
    let round = 1
    Canvas.updateValue(hash, round)
  }

  onDragEnd(event) {
  }

  updateValue() {
    let symbols = Canvas.state.currentSymbols
    let a = -symbols['3'] || -3
    let b = symbols['1'] || 1
    let c = symbols['²'] || 2
    let str = `y = ( x - ${a})^{${c}} + ${b}`
    this.update(str)
  }

  update(equation) {
    try {
      let points = []
      for (let x = -10; x < 10; x += 0.05) {
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
      let x = point.x * this.state.ratio.x + this.props.origin.x
      let y = point.y * this.state.ratio.y + this.props.origin.y
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
        {/*
        <Text
          x={ 967 }
          y={ 1000 }
          text={ this.state.equation }
          fontSize={ 20 }
          fill={ '#ee00ab' }
          width={ 300 }
          height={ 30 }
          offsetX={ 300/2 }
          offsetY={ 30 }
          align='center'
          verticalAlign='middle'
        />
        */}
      </>
    )
  }
}

export default Graph


/* Old code to get ratio */
/*
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
*/
