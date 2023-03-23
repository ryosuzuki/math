
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
    // console.log(this.props.ratio)
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


// import React, { Component } from 'react'
// import { Line, Text } from 'react-konva'
// import { parseTex, evaluateTex } from 'tex-math-parser'
// import * as math from 'mathjs';

// class Graph extends Component {
//   constructor(props) {
//     super(props)
//     window.Graph = this
//     this.state = {
//     }
//   }

//   componentDidMount() {
//   }

//   onDragStart(event) {
//     const target = event.target
//     this.originPos = App.state.mouse
//     this.originSybmols = _.clone(Canvas.state.currentSymbols)
//   }

//   onDragMove(event) {
//     const target = event.target
//     target.x(0)
//     target.y(0)
//     let pos = App.state.mouse
//     let delta = { x: pos.x - this.originPos.x, y: pos.y - this.originPos.y }
//     let a = this.originSybmols['3']
//     let b = this.originSybmols['1']
//     let hash = {}
//     if (!isNaN(a)) {
//       hash['3'] = a - delta.x / this.props.ratio.x
//     }
//     if (!isNaN(b)) {
//       hash['1'] = b + delta.y / this.props.ratio.y
//     }
//     let round = 1
//     Canvas.updateValue(hash, round)
//   }

//   onDragEnd(event) {
//   }

//   renderPoints() {
//     let points = []
//     for (let x = -10; x < 10; x += 0.05) {
//       let answer = evaluateTex(this.props.equation, { x: x });
//       let y = answer.evaluated
//       points.push({ x: x, y: y })
//     }

//     let offset = 50
//     let linePoints = []
//     for (let point of points) {
//       let x = point.x * this.props.ratio.x + this.props.origin.x
//       let y = point.y * -this.props.ratio.y + this.props.origin.y
//       if (isNaN(x) || isNaN(y)) continue
//       if (x < this.props.xAxis[0] - offset || this.props.xAxis[2] + offset < x) continue
//       if (y < this.props.yAxis[1] - offset || this.props.xAxis[3] + offset < y) continue
//       linePoints.push(x, y)
//     }
//     return linePoints
//   }

//   render() {
//     return (
//       <>
//         <Line
//           x={ 0 }
//           y={ 0 }
//           points={ this.renderPoints() }
//           stroke={ App.strokeColor }
//           strokeWidth={ 4 }
//           draggable
//           onDragStart={this.onDragStart.bind(this) }
//           onDragMove={this.onDragMove.bind(this) }
//           onDragEnd={this.onDragEnd.bind(this) }
//         />
//         <Text
//           x={ this.props.origin.x }
//           y={ this.props.origin.y }
//           text={ this.props.equation }
//           fontSize={ 20 }
//           fill={ '#ee00ab' }
//           width={ 300 }
//           height={ 30 }
//           offsetX={ 300/2 }
//           offsetY={ 30 }
//           align='center'
//           verticalAlign='middle'
//           visible={ true }
//         />
//       </>
//     )
//   }
// }

// export default Graph
