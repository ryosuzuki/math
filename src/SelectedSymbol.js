import React, { Component } from 'react'
import { Group, Path, Rect, Text } from 'react-konva'
import svgPathBbox from 'svg-path-bbox'

class SelectedSymbol extends Component {
  constructor(props) {
    super(props)
    window.Symbol = this
    this.state = {
      arrowVisible: false,
      currentX: -1000,
      currentY: -1000,
      currentValue: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      highlight: false,
    }
  }

  componentDidMount() {
  }

  onMouseDown() {
    if (!Canvas.state.selectMode) return
    let id = this.props.symbolId
    let symbols = Canvas.state.currentSymbols
    if (id.includes('mi')) {
      id = 'mi-' + id.split('-mi-')[1]
    }
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

  checkHighlight() {
    let highlight = false
    let id = this.props.symbolId
    let symbols = Canvas.state.currentSymbols
    let sids = Object.keys(symbols)
    for (let sid of sids) {
      if (id.includes(sid)) highlight = true
    }
    // let id = this.props.symbolId
    // if (this.props.equationId === id) highlight = true
    // if (id.includes('mi') && id.split('-mi-')[1] === this.props.equationId.split('-mi-')[1]) highlight = true
    this.setState({ highlight: highlight })
  }

  render() {
    this.checkHighlight()
    return (
      <>
        <Path
          y={ this.props.transform.translate.y }
          className={ this.props.symbolId }
          data={ this.props.pathData }
          fill={ 'black' }
        />
        <Rect
          x={ this.state.x }
          y={ this.state.y }
          width={ this.state.width }
          height={ this.state.width }
          fill={ this.state.highlight ? App.highlightColorAlpha : 'rgba(0, 0, 0, 0)' }
          draggable
          onDragStart={ this.onDragStart.bind(this)}
          onDragMove={ this.onDragMove.bind(this) }
          onDragEnd={ this.onDragEnd.bind(this) }
          onMouseDown={ this.onMouseDown.bind(this) }
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

export default SelectedSymbol