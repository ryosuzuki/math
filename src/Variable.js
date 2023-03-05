import React, { Component } from 'react'
import { Group, Rect, Text } from 'react-konva'

class Variable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      arrowVisible: false,
      currentX: -1000,
      currentY: -1000,
      currentValue: 0
    }
  }

  componentDidMount() {
  }

  onDragStart(event) {
    const target = event.target
    this.originValue = this.props.value
    this.originX = this.props.x + this.props.width/2
    this.originY = this.props.y + this.props.height/2
  }

  onDragMove(event) {
    const target = event.target
    target.x(this.props.x)
    target.y(this.props.y)
    let x = event.evt.clientX
    let y = event.evt.clientY
    this.setState({ currentX: x, currentY: this.originY })
    let dx = x - this.originX
    Canvas.updateValue(this.props.word, this.originValue + dx)
    return false
    // let newValue = this.originValue + dx
    // if (this.props.symbol === 'x') newValue = newValue + 690
    // if (this.props.symbol === 'y') newValue = - (newValue - 400)
    // let newState = {}
    // newState[this.props.symbol] = newValue
    // console.log(this.props.parent)
    // this.props.parent.setState(newState)
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
    let textWidth = 100
    let offsetX = this.props.width / 2 - textWidth/2
    let center = {
      x: this.props.x + offsetX,
      y: this.props.y
    }
    return (
      <>
        <Text
          text={ this.props.value }
          x={ center.x }
          y={ this.props.y }
          fontSize={ 20 }
          fill={ App.highlightColor }
          width={ textWidth }
          height={ this.props.height }
          offsetY={ 20 }
          align='center'
          verticalAlign='middle'
        />
        <Rect
          key={ this.props.i }
          x={ this.props.x }
          y={ this.props.y }
          width={ this.props.width }
          height={ this.props.height }
          fill={ App.highlightColorAlpha }
          draggable
          onDragStart={ this.onDragStart.bind(this)}
          onDragMove={ this.onDragMove.bind(this) }
          onDragEnd={ this.onDragEnd.bind(this) }
          onMouseEnter={ this.onMouseEnter.bind(this) }
          onMouseLeave={ this.onMouseLeave.bind(this) }
        />
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

export default Variable