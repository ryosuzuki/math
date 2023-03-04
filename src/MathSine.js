import React, { Component } from 'react'
import { Line } from 'react-konva'

class MathSine extends Component {
  constructor(props) {
    super(props)
    this.state = {
      points: []
    }
  }

  componentDidMount() {
    const width = 500;
    const height = 200;
    const amplitude = 50;
    const frequency = 0.1;
    const points = [];
    for (let x = 0; x <= width; x += 5) {
      const y = amplitude * Math.sin(frequency * x);
      points.push(x, height / 2 + y);
    }
    this.setState({ points: points })
  }

  render() {
    return (
      <>
        <Line
          points={ this.state.points }
          stroke={ App.strokeColor }
          strokeWidth={ 2 }
          draggable
        />
      </>
    )
  }
}

export default MathSine