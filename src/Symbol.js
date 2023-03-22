import React, { Component } from 'react'
import { Group, Path, Rect, Text } from 'react-konva'
import svgPathBbox from 'svg-path-bbox'

class Symbol extends Component {
  constructor(props) {
    super(props)
    window.Symbol = this
    this.state = {
      arrowVisible: false,
      currentX: -1000,
      currentY: -1000,
      currentValue: 0,
      highlight: false,
    }
  }

  componentDidMount() {
  }

  onMouseDown() {
    if (!Canvas.state.selectMode) return
    let id = this.props.symbolId
    let symbols = Canvas.state.currentSymbols
    // if (id.includes('mi')) {
    //   id = 'mi-' + id.split('-mi-')[1]
    // }
    let ids = Object.keys(symbols)
    console.log(id, ids)
    if (ids.includes(id)) {
      // delete symbols[id]
    } else {
      symbols[id] = 0
    }
    Canvas.setState({ symbols: symbols })
    this.setState({ highlight: true })
  }

  onMouseEnter() {
    let id = this.props.symbolId
    if (id.includes('mo')) return
    if (Canvas.state.selectMode) {
      Equation.setState({ currentId: id })
      this.setState({ highlight: true })
    } else {
      this.setState({ arrowVisible: true })
    }
  }

  onMouseLeave() {
    let id = this.props.symbolId
    if (Canvas.state.selectMode) {
      Equation.setState({ currentId: null })
      this.setState({ highlight: false })
    } else {
      this.setState({ arrowVisible: false })
    }
  }

  onDragStart(event) {
    console.log(event)
    if (Canvas.state.selectMode) return false
    const pos = App.state.mouse
    this.originValue = this.props.value
    this.originX = pos.x
    this.originY = pos.y
  }

  onDragMove(event) {
    if (Canvas.state.selectMode) return false
    const target = event.target
    target.x(this.props.x)
    target.y(this.props.y)
    const pos = App.state.mouse
    this.setState({ currentX: pos.x, currentY: this.originY })
    let dx = pos.x - this.props.x
    dx = dx / 10

    return false
    let hash = {}
    hash[this.props.word] = this.originValue + dx
    let round = this.props.word === '²' ? 0 : 1
    // let round = 1
    Canvas.updateValue(hash, round)
  }

  onDragEnd(event) {
    this.setState({ arrowVisible: false })
  }

  render() {
    let fill = 'rgba(0, 0, 0, 0)'
    if (this.props.selected) fill = App.highlightColorAlpha
    if (this.state.highlight) fill = App.fillColorAlpha
    return (
      <>
        <Path
          y={ this.props.transform.translate.y }
          className={ this.props.symbolId }
          data={ this.props.pathData }
          fill={ 'black' }
        />
        <Rect
          x={ this.props.bbox.x }
          y={ this.props.bbox.y }
          width={ this.props.bbox.width }
          height={ this.props.bbox.height }
          fill={ fill }
          onMouseDown={ this.onMouseDown.bind(this) }
          onMouseEnter={ this.onMouseEnter.bind(this) }
          onMouseLeave={ this.onMouseLeave.bind(this) }
        />
      </>
    )
  }
}

export default Symbol