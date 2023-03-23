import React, { Component } from 'react'
import { Group, Path, Rect, Text } from 'react-konva'

class Slider extends Component {
  constructor(props) {
    super(props)
    window.Slider = this
    this.state = {
      arrowVisible: false,
      originX: 0,
      originY: 0,
      currentX: -1000,
      currentY: -1000,
      currentValue: 0,
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <>
        <Text
          x={ this.state.currentX }
          y={ this.state.currentY }
          text={ '↔' }
          fontSize={ 40 }
          fill={ '#ee00ab' }
          width={ 100 }
          height={ 30 }
          offsetX={ 100/2 }
          offsetY={ -20 }
          align='center'
          verticalAlign='middle'
          visible={ this.state.arrowVisible }
        />
      </>
    )
  }
}

export default Slider