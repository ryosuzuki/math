import React, { Component } from 'react'
import { Line } from 'react-konva'

class DrawingLine extends Component {
  constructor(props) {
    super(props)
    window.DrawingLine = this
    this.state = {
      isPaint: false,
      currentPoints: [],
      currentPaths: [],
    }
  }

  componentDidMount() {
  }

  mouseDown() {
    let pos = Canvas.stage.getPointerPosition()
    this.setState({ isPaint: true, currentPoints: [pos.x, pos.y, pos.x, pos.y] })
  }

  mouseMove() {
    let pos = Canvas.stage.getPointerPosition()
    if (!this.state.isPaint) return false
    let points = this.state.currentPoints
    if (points[points.length-2] === pos.x && points[points.length-1] === pos.y) return false
    points = points.concat([pos.x, pos.y])
    this.setState({ currentPoints: points })
  }

  mouseUp() {
    let pos = Canvas.stage.getPointerPosition()
    if (!this.state.isPaint) return false
    this.setState({ isPaint: false })
    if (this.state.currentPoints.length === 0) return false
  }

  render() {
    return (
      <>
        <Line
          points={ this.state.currentPoints }
          stroke={ App.strokeColor }
          strokeWidth={ App.strokeWidth }
        />
      </>
    )
  }
}

export default DrawingLine