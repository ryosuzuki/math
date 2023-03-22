import React, { Component } from 'react'
import { Group, Path, Rect, Text } from 'react-konva'
import svgPathBbox from 'svg-path-bbox'

class Symbol extends Component {
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

  onMouseDown() {
    let id = this.props.symbolId
    if (!Canvas.state.selectMode) return
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
  }

  onMouseEnter() {
    let id = this.props.symbolId
    if (id.includes('mo')) return
    if (Canvas.state.selectMode) {
      Equation.setState({ currentId: id })
    } else {
      this.setState({ arrowVisible: true })
    }
  }

  onMouseLeave() {
    let id = this.props.symbolId
    if (Canvas.state.selectMode) {
      Equation.setState({ currentId: null })
    } else {
      this.setState({ arrowVisible: false })
    }
  }

  onDragStart(event) {
    if (Canvas.state.selectMode) return false
    const target = event.target
    this.originValue = this.props.value
    this.originX = this.props.x + this.props.width/2
    this.originY = this.props.y + this.props.height/2
  }

  onDragMove(event) {
    if (Canvas.state.selectMode) return false
    const target = event.target
    target.x(this.props.x)
    target.y(this.props.y)
    let pos = App.state.mouse
    this.setState({ currentX: pos.x, currentY: this.originY })
    let dx = pos.x - this.props.x
    dx = dx / 10
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
    let id = this.props.symbolId
    const bbox = svgPathBbox(this.props.pathData)
    const offset = 500
    let color = 'black'
    let fill = 'rgba(0, 0, 0, 0)'
    let highlight = false
    if (this.props.equationId === id) highlight = true
    if (this.props.equationId && id.includes('mi') && id.split('-mi-')[1] === this.props.equationId.split('-mi-')[1]) highlight = true

    let symbols = Canvas.state.currentSymbols
    let sids = Object.keys(symbols)
    // console.log(sid)
    for (let sid of sids) {
      if (id.includes(sid)) highlight = true
    }
    if (highlight) {
      color = App.highlightColor
      fill = App.highlightColorAlpha
    }
    /*
      mi: [x, y], mo: [+, =, ()], mn: [1, 2, 3], msup: [^2]
      1D466: y, 1D465: x, ...
      30: 0, 31: 1, 32: 2, ...
      - x^2 = msup-mi-1D465, msup-mn-32
      - 10  = mn-31-30
      - \sqrt{x} = msqrt-mo-221A, msqrt-mi-1D465
    */
    return (
      <>
        <Path
          y={ this.props.transform.translate.y }
          className={ this.props.symbolId }
          data={ this.props.pathData }
          fill={ color }
        />
        <Rect
          y={ bbox[1] - offset/2 }
          width={ bbox[2] - bbox[0] + offset }
          height={ bbox[3] - bbox[1] + offset }
          fill={ fill }
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

export default Symbol