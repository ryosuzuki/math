import React, { Component } from 'react'
import { Group, Path, Rect, Text } from 'react-konva'
import svgPathBbox from 'svg-path-bbox'

class Symbol extends Component {
  constructor(props) {
    super(props)
    window.Symbol = this
    this.state = {
      highlight: false,
    }
  }

  componentDidMount() {
    if (this.props.bbox.x > 200000) {
      console.log(this)
      console.log(this.props.bbox)
    }
  }

  onMouseDown() {
    if (!Canvas.state.selectMode) return
    let tag = this.props.tag
    let symbols = Canvas.state.currentSymbols
    // if (id.includes('mi')) {
    //   id = 'mi-' + id.split('-mi-')[1]
    // }
    let tags = Object.keys(symbols)
    let ascii = Canvas.convertAscii(tag)
    console.log(tag, ascii, tags)
    let num = Number(ascii)
    if (tags.includes(tag)) {
      delete symbols[tag]
    } else {
      symbols[tag] = isNaN(num) ? 0 : num
    }
    Canvas.setState({ symbols: symbols })
    this.setState({ highlight: true })
  }

  onMouseEnter() {
    let id = this.props.id
    console.log(id)
    if (id.includes('mo')) return
    if (Canvas.state.selectMode) {
      this.setState({ highlight: true })
    }
  }

  onMouseLeave() {
    let id = this.props.id
    if (Canvas.state.selectMode) {
      this.setState({ highlight: false })
    }
  }

  onDragStart(event) {
    if (Canvas.state.selectMode) return false
    const pos = App.state.mouse
    this.originValue = Canvas.state.currentSymbols[this.props.tag]
    this.originX = this.props.center.x
    this.originY = this.props.center.y
    Slider.setState({ arrowVisible: true })
  }

  onDragMove(event) {
    if (Canvas.state.selectMode) return false
    const target = event.target
    target.x(this.props.bbox.x)
    target.y(this.props.bbox.y)
    const pos = App.state.mouse
    Slider.setState({ currentX: pos.x, currentY: this.originY })

    let dx = pos.x - this.originX
    dx = dx / 10
    // console.log(pos, dx)

    let newSymbols = {}
    newSymbols[this.props.tag] = this.originValue + dx
    // let round = this.props.word === '²' ? 0 : 1
    let round = 1
    Canvas.updateValue(newSymbols, round)
  }

  onDragEnd(event) {
    Slider.setState({ arrowVisible: false })
  }

  render() {
    let fill = 'rgba(0, 0, 0, 0)'
    if (Object.keys(Canvas.state.currentSymbols).includes(this.props.tag)) fill = App.highlightColorAlpha
    if (this.state.highlight) fill = App.highlightColorAlpha

    return (
      <Group key={ this.props.id}>
        {/* Text for current value */}
        { Canvas.state.currentSymbols[this.props.tag] !== undefined &&
          <Text
            text={ Canvas.state.currentSymbols[this.props.tag] }
            x={ this.props.center.x }
            y={ this.props.center.y }
            fontSize={ 20 }
            fill={ '#ee00ab' }
            width={ 100 }
            height={ 30 }
            offsetX={ 100/2 }
            offsetY={ 40 }
            align='center'
            verticalAlign='middle'
          />
        }
        {/* SVG path for each symbol */}
        <Path
          data={ this.props.pathData}
          fill={ 'black' }
        />
        {/* Bounding box for each symbol */}
        <Rect
          x={ this.props.bbox.x }
          y={ this.props.bbox.y }
          width={ this.props.bbox.width }
          height={ this.props.bbox.height }
          fill={ fill }
          draggable
          onDragStart={ this.onDragStart.bind(this)}
          onDragMove={ this.onDragMove.bind(this) }
          onDragEnd={ this.onDragEnd.bind(this) }
          onMouseDown={ this.onMouseDown.bind(this) }
          onMouseEnter={ this.onMouseEnter.bind(this) }
          onMouseLeave={ this.onMouseLeave.bind(this) }
        />
      </Group>
    )
  }
}

export default Symbol