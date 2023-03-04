import React, { Component } from 'react'
import { Group, Circle } from 'react-konva'

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

  render() {
    return (
      <>
        <Group
          x={ this.state.x }
          y={ this.state.y }
          draggable
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
            onDragMove={this.handleDragMove}
          />
        </Group>
      </>
    )
  }
}

export default MathCircle