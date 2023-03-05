import React, { Component } from 'react'
import { Group, Circle } from 'react-konva'

import Variable from './Variable.js'
import _ from 'lodash'

class MathCircle extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.origin = { x: 687, y: 400 }
  }

  componentDidMount() {
  }

  onDragMove(event) {
    const x = event.evt.clientX
    const y = event.evt.clientY
    let h = x - this.origin.x
    let k = this.origin.y - y
    Canvas.updateValue({ h: h, k: k })
  }

  onDragMoveRadius(event) {
    const x = event.evt.clientX
    const y = event.evt.clientY
    let currentSymbols = Canvas.state.currentSymbols
    let h = currentSymbols['h']
    let k = currentSymbols['k']
    let center = { x: this.origin.x + h, y: this.origin.y - k }
    const dx = center.x - x
    const dy = center.y - y
    const radius = Math.sqrt(dx**2 + dy**2)
    Canvas.updateValue({ r: radius })
  }

  dragBound(pos) {
    return { x: pos.x, y: pos.y }
  }

  render() {
    let currentSymbols = Canvas.state.currentSymbols
    if (!_.has(currentSymbols, 'h') || !_.has(currentSymbols, 'k') || !_.has(currentSymbols, 'r')) {
      return <></>
    }
    let radius = currentSymbols['r']
    let h = currentSymbols['h']
    let k = currentSymbols['k']
    let center = { x: this.origin.x + h, y: this.origin.y - k }
    return (
      <>
        <Circle
          x={ center.x }
          y={ center.y }
          radius={ radius }
          strokeWidth={ App.strokeWidth }
          stroke={ App.strokeColor }
          fill={ App.fillColorAlpha }
          draggable
          onDragMove={this.onDragMove.bind(this) }
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
          onDragMove={this.onDragMoveRadius.bind(this) }
        />
      </>
    )
  }
}

export default MathCircle