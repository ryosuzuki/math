import React, { Component } from 'react'
import { Circle, Shape } from 'react-konva'

class Triangle extends Component {
  constructor(props) {
    super(props);
    window.Triangle = this
    this.state = {}
    this.state.ac = { x: 840, y: 1215 }
    this.state.cb = { x: 1050, y: 1085 }
    this.state.ab = { x: 1050, y: 1215 }
  }

  componentDidMount() {
    this.update()
  }

  update() {
    const a = Math.sqrt((this.state.ab.x - this.state.ac.x)**2 + (this.state.ab.y - this.state.ac.y)**2)
    const b = Math.sqrt((this.state.ab.x - this.state.cb.x)**2 + (this.state.ab.y - this.state.cb.y) ** 2)
    const c = Math.sqrt((this.state.cb.x - this.state.ac.x)**2 + (this.state.cb.y - this.state.ac.y)**2)
    const currentSymbols = Canvas.state.currentSymbols
    currentSymbols['1D44E'] = Math.floor(a) / 100
    currentSymbols['1D44F'] = Math.floor(b) / 100
    currentSymbols['1D450'] = Math.floor(c) / 100
    Canvas.setState({ currentSymbols: currentSymbols })
  }

  updateFigure() {
    const currentSymbols = Canvas.state.currentSymbols
    const a = currentSymbols['1D44E'] * 100
    const b = currentSymbols['1D44F'] * 100
    const c = currentSymbols['1D450'] * 100
    const ac = { x: this.state.ab.x - a, y: this.state.ac.y }
    const cb = { x: this.state.cb.x, y: this.state.ab.y - b }
    this.setState({ ac: ac, cb: cb }, () => {
      this.update()
    })
  }

  onDragMove(event) {
    const id = event.target.attrs.id
    const target = event.target
    const point = this.state[id]
    if (id === 'ac') point.x = event.target.attrs.x
    if (id === 'cb') point.y = event.target.attrs.y
    this.setState(state => ({ ...state, [id]: point }))
    target.x(point.x)
    target.y(point.y)
    this.update()
  }

  render() {
    return (
      <>
        <Shape
          sceneFunc={(context, shape) => {
            context.beginPath();
            context.moveTo(this.state.ac.x, this.state.ac.y);
            context.lineTo(this.state.cb.x, this.state.cb.y);
            context.lineTo(this.state.ab.x, this.state.ab.y);
            context.lineTo(this.state.ac.x, this.state.ac.y);
            context.closePath();
            context.fillStrokeShape(shape);
          }}
          fill={ App.highlightColorAlpha }
          stroke={ 'black' }
        />
        <Circle
          id={ 'ac' }
          radius={ 5 }
          fill={ 'black' }
          x={ this.state.ac.x }
          y={ this.state.ac.y }
          draggable
          onDragMove={ this.onDragMove.bind(this) }
        />
        <Circle
          id={ 'cb' }
          radius={ 5 }
          fill={ 'black' }
          stroke={ 'black' }
          x={ this.state.cb.x }
          y={ this.state.cb.y}
          draggable
          onDragMove={ this.onDragMove.bind(this) }
        />
      </>
    );
  }
}

export default Triangle