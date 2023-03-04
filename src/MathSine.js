import React, { Component } from 'react'
import { Group, Line, Circle } from 'react-konva'

class MathSine extends Component {
  constructor(props) {
    super(props)
    this.state = {
      x: 300,
      y: 300,
      dx: 0,
      dy: 0,
      points: [],
      width: 1500,
      height: 1200,
      amplitude: 50,
      frequency: 0.1,
    }
  }

  componentDidMount() {
    this.draw()
  }

  draw() {
    const points = [];
    for (let x = -this.state.width/2; x <= this.state.width/2; x += 5) {
      const y = this.state.amplitude * Math.sin(this.state.frequency * x) - this.state.height/2
      points.push(x, this.state.height / 2 + y);
    }
    this.setState({ points: points })
  }

  handleDragMove(event) {
    const x = event.evt.clientX
    const y = event.evt.clientY
    const dx = x - this.state.x
    const dy = y - this.state.y
    this.setState({ dx: dx, dy: 0 })
  }

  handleDragMove2(event) {
    let x = event.evt.clientX
    let dx = x - this.state.x
    let frequency = 2*Math.PI / dx
    this.setState({ frequency: frequency })
    this.draw()
  }

  horizontalDragBound(pos) {
    return { x: pos.x, y: this.state.y }
  }

  verticalDragBound(pos) {
    return { x: this.state.x, y: pos.y }
  }

  render() {
    return (
      <>
        <Group
          x={ this.state.x }
          y={ this.state.y }
          width={ 500 }
          height={ 200 }
          draggable
        >
          <Line
            x={ this.state.dx }
            y={ 0 }
            points={ this.state.points }
            stroke={ App.strokeColor }
            strokeWidth={ App.strokeWidth }
          />
          <Circle
            x={ 0 }
            y={ 0 }
            radius={ 10 }
            fill={ '#ee00ab' }
            visible={ true }
            draggable
            dragBoundFunc={this.horizontalDragBound.bind(this)}
            onDragMove={this.handleDragMove.bind(this)}
          />
          <Circle
            x={ 2*Math.PI / this.state.frequency }
            y={ 0 }
            radius={ 10 }
            fill={ '#ee00ab' }
            visible={ true }
            draggable
            dragBoundFunc={this.horizontalDragBound.bind(this)}
            onDragMove={this.handleDragMove2.bind(this)}
          />
        </Group>
      </>
    )
  }
}

export default MathSine