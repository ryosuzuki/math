import React, { Component } from 'react'
import { Group, Rect, Text } from 'react-konva'

class MathText extends Component {
  constructor(props) {
    super(props)
    this.state = {
      arrowVisible: false,
      currentX: -1000,
      currentY: -1000,
    }
  }

  componentDidMount() {
  }

  onDragStart(event) {
    const target = event.target
    this.originValue = this.props.value
    this.originX = event.evt.clientX
    this.originY = event.evt.clientY
  }

  onDragMove(event) {
    const group = event.target
    let originX = this.props.x - 20
    let originY = this.props.y - 50
    let x = event.evt.clientX
    let y = event.evt.clientY
    this.setState({ currentX: x, currentY: this.originY })
    let dx = x - originX
    console.log(dx)
    group.x(originX)
    group.y(originY)
    let newValue = this.originValue + dx
    if (this.props.symbol === 'x') newValue = newValue + 690
    if (this.props.symbol === 'y') newValue = - (newValue - 400)
    let newState = {}
    newState[this.props.symbol] = newValue
    console.log(this.props.parent)
    this.props.parent.setState(newState)
  }

  onDragEnd(event) {
    this.setState({ arrowVisible: false })
  }

  onMouseEnter(event) {
    this.setState({ arrowVisible: true })
  }

  onMouseLeave(event) {
    this.setState({ arrowVisible: false })
  }

  render() {
    return (
      <>
        <Group
          x={ this.props.x - 20 }
          y={ this.props.y - 50 }
          draggable
          onDragStart={ this.onDragStart.bind(this)}
          onDragMove={ this.onDragMove.bind(this) }
          onDragEnd={ this.onDragEnd.bind(this) }
          onMouseEnter={ this.onMouseEnter.bind(this) }
          onMouseLeave={ this.onMouseLeave.bind(this) }
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
        <Text
          x={ this.state.currentX }
          y={ this.state.currentY }
          text={ '<->' }
          fontSize={ 20 }
          fill={ '#ee00ab' }
          width={ 50 }
          height={ 30 }
          offsetX={ (50-30)/2 }
          align='center'
          verticalAlign='middle'
          visible={ this.state.arrowVisible }
        />
      </>
    )
  }
}

export default MathText