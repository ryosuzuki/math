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
    let newSmbols = {
      "a²": Math.floor(((ab.x - ac.x) ** 2 + (ab.y - ac.y) ** 2) / factor),
      "b²": Math.floor(((ab.x - cb.x) ** 2 + (ab.y - cb.y) ** 2) / factor),
      "c²": Math.floor(((cb.x - ac.x) ** 2 + (cb.y - ac.y) ** 2) / factor),
    };
    onTriangleChange({ ...currentSymbols, ...new_symbols });

    if (a !== undefined && b !== undefined && c !== undefined) {
      if (a > 0 && b > 0 && c > 0) {
        setCb({ x: cb.x, y: ab.y - Math.sqrt(b * factor) });
        setAc({ x: ab.x - Math.sqrt(a * factor), y: ac.y });
        // Update c in the current symbols
        let new_symbols = currentSymbols;
        new_symbols["c²"] = Math.floor(
          ((cb.x - ac.x) ** 2 + (cb.y - ac.y) ** 2) / factor
        );
      }
    }
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
          radius={5}
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