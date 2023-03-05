import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line, Group, Circle, Path, Image, Shape} from 'react-konva'
import Konva from 'konva'
import _ from 'lodash'

import ocr from './sample/ocr-2.json'

class Words extends Component {
  constructor(props) {
    super(props)
    window.Words = this
    this.state = {
      textAnnotations: [],
      currentId: -1,
      symbols: []
    }
  }

  componentDidMount() {
    window.ocr = ocr
    const rawtext = ocr.textAnnotations[0].description
    const text = rawtext.replace(/(\r\n|\n|\r)/gm, " ")

    let words = ['h', 'k', 'r']
    console.log(words)
    // let textAnnotations = ocr.textAnnotations.filter((textAnnotation) => {
    //   return words.includes(textAnnotation.description)
    // })
    // console.log(textAnnotations)
    let textAnnotations = ocr.textAnnotations
    textAnnotations.shift()
    this.setState({ textAnnotations: textAnnotations })
  }

  onMouseDown(i) {
    if (!this.props.selectMode) return
    console.log(this.state.textAnnotations[i])
    let word = this.state.textAnnotations[i].description
    let symbols = this.state.symbols
    if (symbols.includes(word)) {
      _.pull(symbols, word)
    } else {
      symbols.push(word)
    }
    this.setState({ symbols: symbols })
  }

  onMouseEnter(i) {
    if (!this.props.selectMode) return
    this.setState({ currentId: i })
  }

  onMouseLeave(i) {
    if (!this.props.selectMode) return
    this.setState({ currentId: -1 })
  }

  render() {
    return (
      <>
        <Text
          text={ `Selected Variables: ${ this.state.symbols }` }
          x={ 50 }
          y={ 50 }
          fontSize={ 20 }
          fill={ App.highlightColor }
        />
        { this.state.textAnnotations.map((textAnnotation, i) => {
          let word = textAnnotation.description
          let offset = 5
          let vertices = textAnnotation.boundingPoly.vertices
          let x = vertices[0].x - offset/2
          let y = vertices[0].y - offset/2
          let width = vertices[2].x - vertices[0].x + offset
          let height = vertices[2].y - vertices[0].y + offset
          let color = 'rgba(0, 0, 0, 0.05)'
          if (this.state.symbols.includes(word)) color = App.highlightColorAlpha
          if (this.state.currentId === i) color = App.highlightColorAlpha
          return (
            <Rect
              key={ i }
              x={ x }
              y={ y }
              width={ width }
              height={ height }
              fill={ color }
              onMouseDown={ this.onMouseDown.bind(this, i) }
              onMouseEnter={ this.onMouseEnter.bind(this, i) }
              onMouseLeave={ this.onMouseLeave.bind(this, i) }
            />
          )
        })}
      </>
    )
  }
}

export default Words