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
    let pos = App.state.mouse
    let h = pos.x - this.origin.x
    let k = this.origin.y - pos.y
    Canvas.updateValue({ h: h, k: k })
  }

  onDragMoveRadius(event) {
    let pos = App.state.mouse
    let currentSymbols = Canvas.state.currentSymbols
    let h = currentSymbols['h']
    let k = currentSymbols['k']
    let center = { x: this.origin.x + h, y: this.origin.y - k }
    const dx = center.x - pos.x
    const dy = center.y - pos.y
    const radius = Math.sqrt(dx**2 + dy**2)
    Canvas.updateValue({ r: radius })
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