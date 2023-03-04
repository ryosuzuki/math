import React, { Component } from 'react'
import { Group, Rect, Text } from 'react-konva'

class MathText extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '2.3'
    }
  }

  componentDidMount() {
  }

  handleDragMove = (event) => {
    console.log(event.evt.clientX, event.evt.clientY)
  }

  render() {
    return (
      <>
        <Group
          x={ this.props.x - 20 }
          y={ this.props.y - 50 }
          draggable
          onDragMove={this.handleDragMove}
        >
          <Rect
            x={ 0 }
            y={ 0 }
            width={ 30 }
            height={ 30 }
            fill='rgba(255, 255, 255, 0.9)'
          />
          <Text
            text={ this.props.value }
            fontSize={ 20 }
            fill={ '#ee00ab' }
            width={ 50 }
            height={ 30 }
            offsetX={(50-30)/2}
            align='center'
            verticalAlign='middle'
          />
          <Rect
            x={0}
            y={40}
            width={30}
            height={30}
            fill='rgba(238, 0, 171, 0.3)'
          />
        </Group>
      </>
    )
  }
}

export default MathText