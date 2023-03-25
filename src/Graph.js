import React, { Component } from 'react'
import { Line, Text } from 'react-konva'
import texMathParser from 'tex-math-parser'
import * as math from 'mathjs';
import mathsteps from 'mathsteps'
import algebra from 'algebra.js'
import fractional from 'fractional'
import nerdamer from 'nerdamer/all.min.js'

class Graph extends Component {
  constructor(props) {
    super(props)
    window.Graph = this
    this.state = {
      points: [],
      equation: null,
    }
    window.math = math
    window.texMathParser = texMathParser
    window.mathsteps = mathsteps
    window.algebra = algebra
    window.fractional = fractional
    window.nerdamer = nerdamer
  }

  componentDidMount() {
    const expression = math.parse('x^2 + y^2');
    math.simplify(expression, {x: 3}).toString()
    // 'y ^ 2 + 9'

    let a = 'x^2 + y^2 = 16'
    let b = new algebra.parse(a)
    let c = b.eval({x: 1}).solveFor('y')
    // [-3.872983346207417, 3.872983346207417]

    a = '(x-h)^2 + (y - k)^2 = r^2'
    b = new algebra.parse(a)
    c = b.eval({x: 1, h: 1, k: 1, r: 1}).solveFor('y')
  }

  update(equation) {
    equation = equation.replace(/f\(x\)/g, 'y')
    equation = equation.replace(/g\(x\)/g, 'y')
    equation = equation.replace(/h\(x\)/g, 'y')

    console.log(equation)
    if (App.sampleId === 2) {
      this.updateCircle(equation)
    } else {
      this.update1(equation)
    }
  }

  updateCircle(equation) {
    const currentSymbols = Canvas.state.currentSymbols
    const asciiSymbols = {}
    for (let tag of Object.keys(currentSymbols)) {
      const ascii = Canvas.convertAscii(tag)
      asciiSymbols[ascii] = currentSymbols[tag]
    }
    let r = asciiSymbols['r']
    let h = asciiSymbols['h']
    let k = asciiSymbols['k']

    const equation1 = 'y = \\sqrt{r^2 - (x - h)^2} + k'
    const equation2 = 'y = -\\sqrt{r^2 - (x - h)^2} + k'
    try {
      let points = []
      for (let x = -10; x <= 10; x += 0.05) {
        let answer = texMathParser.evaluateTex(equation1, { x: x, r: r, h: h, k: k });
        let y = answer.evaluated
        if (isNaN(y) && h-r-0.1 <= x && h+r > x) {
          y = y.re
        }
        points.push({ x: x, y: y })
      }
      for (let x = 10; x >= -10; x -= 0.05) {
        let answer = texMathParser.evaluateTex(equation2, { x: x, r: r, h: h, k: k });
        let y = answer.evaluated
        if (isNaN(y) && h-r-0.1 <= x && h+r > x) {
          y = y.re
        }
        points.push({ x: x, y: y })
      }
      this.setState({ points: points })
    } catch (err) {
      console.error(err)
    }
  }

  update1(equation) {
    try {
      let points = []
      for (let x = -10; x < 10; x += 0.05) {
        let answer = texMathParser.evaluateTex(equation, { x: x });
        let y = answer.evaluated
        if (isNaN(y)) y = y.re
        points.push({ x: x, y: y })
      }
      this.setState({ points: points })
    } catch (err) {
      console.error(err)
    }
  }

  update2(equation) {
    try {
      const points = []
      equation = equation.replace(/\{/g, '')
      equation = equation.replace(/\}/g, '')
      let expressions = nerdamer.solveEquations(equation, 'y')
      console.log(expressions[0].text(), equation)
      for (let x = -10; x < 10; x += 0.5) {
        for (let expression of expressions) {
          let answer = nerdamer(expression.text(), { x: x }, 'numer')
          let y = Number(answer.text())
          points.push({ x: x, y: y })
        }
      }
      this.setState({ points: points })
    } catch (err) {
      console.error(err)
    }
  }

  update3(equation) {
    try {
      const points = []
      // const eq = texMathParser.parseTex(equation).toString()
      const expression = new algebra.parse(eq)
      console.log(eq, expression)
      // x: -10 to 10 with 0.05 step
      for (let x = -200; x < 200; x += 1) {
        let xa = new algebra.Fraction(x, 20)
        let answers = expression.eval({ x: xa }).solveFor('y')
        if (!answers.length) answers = [answers]
        for (let answer of answers) {
          let y = answer.numer / answer.denom
          points.push({ x: x / 20, y: y })
        }
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
    // TODO
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

      const data = { x1: x1, y1: y1, x2: x2, y2: y2 }
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
    })
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