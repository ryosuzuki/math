import React, { Component } from 'react'
import { Group, Circle } from 'react-konva'

import MathText from './MathText.js'

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
    let symbols = {
      x: [
        { x: 330, y: 300 },
        { x: 450, y: 180 },
      ],
      y: [
        { x: 400, y: 300 },
        { x: 530, y: 180 },
      ],
      radius: [
        { x: 440, y: 300 },
        { x: 580, y: 180 },
      ]
    }
    return (
      <>
        <Group
          x={ this.state.x }
          y={ this.state.y }
          draggable
          onDragMove={ this.handleDragMove2.bind(this) }
        >
          <Circle
            x={ 0 }
            y={ 0 }
            radius={ this.state.radius }
            strokeWidth={ App.strokeWidth }
            stroke={ App.strokeColor }
            fill={ App.fillColorAlpha }
            visible={ true }
          />
          <Circle
            x={ 0 }
            y={ 0 }
            radius={ 10 }
            fill={ App.strokeColor }
            visible={ true }
          />
          <Circle
            x={ this.state.radius * Math.sin(Math.PI/4) }
            y={ -this.state.radius * Math.sin(Math.PI/4) }
            radius={ 10 }
            fill={ '#ee00ab' }
            visible={ true }
            draggable
            onDragMove={this.handleDragMove.bind(this) }
            onMouseEnter={ e => {
              e.cancelBubble = true;
            }}
          />
        </Group>
        { Object.keys(symbols).map((symbol, i) => {
          let positions = symbols[symbol]
          return positions.map((pos, j) => {
            let value = this.state[symbol]
            switch (symbol) {
              case 'x':
                value = value - 690
                break
              case 'y':
                value = - (value - 400)
                break
            }
            return (
              <MathText
                key={ `${i}-${j}` }
                symbol={ symbol }
                value={ value }
                x={ pos.x }
                y={ pos.y }
              />
            )
          })
        })}
      </>
    )
  }
}

export default MathCircle