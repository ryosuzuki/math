import React, { Component } from 'react'
import { Circle } from 'react-konva'

class MathCircle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      x: 800,
      y: 300,
      radius: 50
    }
  }

  componentDidMount() {
  }

  handleDragMove = (event) => {
    const { radius } = this.state;
    const { x, y } = event.target.attrs;
    const dx = event.target.getStage().getPointerPosition().x - x;
    const dy = event.target.getStage().getPointerPosition().y - y;
    const newRadius = Math.max(10, radius + dx + dy);
    this.setState({ circle: {
      radius: newRadius,
      x: x - dx,
      y: y - dy,
    }})
  };

  render() {
    return (
      <>
        <Circle
          x={ this.state.x }
          y={ this.state.y }
          radius={ this.state.radius }
          strokeWidth={ App.strokeWidth }
          stroke={ App.strokeColor }
          fill={ App.fillColorAlpha }
          visible={ true }
          draggable
          onDragMove={this.handleDragMove}
        />
      </>
    )
  }
}

export default MathCircle