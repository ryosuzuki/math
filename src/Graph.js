import React, { Component } from 'react'
import { Line, Text } from 'react-konva'
import { parseTex, evaluateTex } from 'tex-math-parser'
import * as math from 'mathjs';

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
    this.state.equation = this.props.equation
    console.log(this.props.ratio)
    this.state.ratio = this.props.ratio
  }

  componentDidMount() {
    this.update(this.state.equation)
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

  getRatio() {
    window.math = math

    try {
      let points = this.props.segments.map((segment) => { return { x: segment[1], y: segment[2] } })
      window.points = points

      let p1 = points[0]
      let p2 = _.last(points)

      if (!p1 || !p2) return
      let x1 = p1.x - this.props.origin.x
      let y1 = this.props.origin.y - p1.y
      let x2 = p2.x - this.props.origin.x
      let y2 = this.props.origin.y - p2.y

      const data = { equation: this.state.equation, x1: x1, y1: y1, x2: x2, y2: y2 }
      console.log('emit sympy ' + JSON.stringify(data))
      App.socket.emit('sympy', data)
    } catch (err) {
      console.error(err)
    }

    App.socket.on('sympy', (json) => {
      console.log(json)
      json = JSON.parse(json)
      if (!json.x || !json.y) return

      let xRatio = Number(json.x)
      let yRatio = Number(json.y)
      let ratio = { x: xRatio, y: -yRatio }
      console.log(ratio)
      this.setState({ ratio: ratio })
      this.update(this.state.equation)
    })
  }

  convert(points) {
    let offset = 50
    let linePoints = []
    for (let point of points) {
      let x = point.x * this.state.ratio.x + this.props.origin.x
      let y = point.y * -this.state.ratio.y + this.props.origin.y
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





    // const eq1 = '-48.5*b = sqrt(a) - 2';
    // const eq2 = '-1.5*b = sqrt(97*a) - 2';
    // const expr1 = math.parse(eq1);
    // const expr2 = math.parse(eq2);
    // const simplified1 = math.simplify(eq1);
    // const simplified2 = math.simplify(eq2);



    // const variables = ['a', 'b'];
    // const expr2 = math.parse(eq2);
    // const scope = { a: null, b: null };
    //  const compiled1 = expr1.compile();
    // const compiled2 = expr2.compile();
    // const solveForA = (bValue) => {
    //   scope.b = bValue;
    //   return compiled1.evaluate(scope);
    // }
    // const solveForB = (aValue) => {
    //   scope.a = aValue;
    //   return compiled2.evaluate(scope);
    // }









    // const eq1 = '-48.5*b == sqrt(a) - 2';
    // const eq2 = '-1.5*b == sqrt(97*a) - 2';
    // const simplified1 = math.simplify(eq1);
    // const simplified2 = math.simplify(eq2);
    // const variables = ['a', 'b'];
    // // const solutions = math.solve([simplified1, simplified2], variables);


    // const parsed1 = math.parse(eq1);
    // const parsed2 = math.parse(eq2);
    // // const simplified1 = parsed1.simplify();
    // // const simplified2 = parsed2.simplify();
    // const solutions = math.evaluate(`solve([${simplified1}, ${simplified2}], ${JSON.stringify(variables)})`);



    // let xRatios = []
    // for (let point of points) {
    //   let answer = evaluateTex('x = (y + 2)^2', { y: point.y });
    //   let x = answer.evaluated
    //   console.log(x)
    //   let xRatio =  point.x / x
    //   xRatios.push(xRatio)
    // }

    // console.log(points)
    // let xRatios = []
    // for (let point of points) {
    //   let answer = evaluateTex(this.state.equation, { y: point.y })
    //   let x = answer.evaluated
    //   let xRatio = point.x / x
    //   xRatios.push(xRatio)
    // }
    // console.log(xRatios)
    // console.log(yRatios)
    // let xRatio = _.mean(xRatios)
    // let yRatio = _.mean(yRatios)