import React, { Component } from 'react'
import { Group, Circle } from 'react-konva'

import Variable from './Variable.js'
import _ from 'lodash'

class MathCircle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      x: 800,
      y: 300,
      radius: 50,
    }
  }

  componentDidMount() {
  }

  handleDragMove = (event) => {
    const x = event.evt.clientX
    const y = event.evt.clientY
    const dx = this.state.x - x
    const dy = this.state.y - y
    const radius = Math.sqrt(dx**2 + dy**2)
    this.setState({ radius: radius })
  }

  handleDragMove2 = (event) => {
    let target = event.target.getClassName()
    if (target !== 'Group') return
    const x = event.evt.clientX
    const y = event.evt.clientY
    this.setState({ x: x, y: y })
  }

  dragBound(pos) {
    return { x: pos.x, y: pos.y }
  }

  render() {
    let currentSymbols = Canvas.state.currentSymbols
    if (!_.has(currentSymbols, 'h') || !_.has(currentSymbols, 'k') || !_.has(currentSymbols, 'r')) {
      return <></>
    }
    let origin = { x: 687, y: 400 }
    let radius = currentSymbols['r']
    let h = currentSymbols['h']
    let k = currentSymbols['k']
    let center = { x: origin.x + h, y: origin.y - k }
    return (
      <>
        <Circle
          x={ center.x }
          y={ center.y }
          radius={ radius }
          strokeWidth={ App.strokeWidth }
          stroke={ App.strokeColor }
          fill={ App.fillColorAlpha }
        />
        <Circle
          x={ center.x }
          y={ center.y }
          radius={ 3 }
          fill={ App.highlightColor }
        />
        <Circle
          x={ center.x + radius * Math.sin(Math.PI/4) }
          y={ center.y - radius * Math.sin(Math.PI/4) }
          radius={ 10 }
          fill={ App.highlightColor }
          draggable
          onDragMove={this.handleDragMove.bind(this) }
          onMouseEnter={ e => {
            e.cancelBubble = true;
          }}
        />
      </>
    )
  }
}

export default MathCircle