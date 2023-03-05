import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line, Group, Circle, Path, Image, Shape} from 'react-konva'
import Konva from 'konva'
import _ from 'lodash'
import Variable from './Variable.js'

class Words extends Component {
  constructor(props) {
    super(props)
    window.Words = this
    this.state = {
      textAnnotations: [],
      currentId: -1,
    }
  }

  componentDidMount() {
    const url = `http://localhost:4000/public/sample/ocr-${App.sampleId}.json`
    this.fetchData(url)
  }

  async fetchData(url) {
    try {
      const response = await fetch(url)
      const jsonData = await response.json()
      const ocr = jsonData
      window.ocr = ocr
      const rawtext = ocr.textAnnotations[0].description
      const text = rawtext.replace(/(\r\n|\n|\r)/gm, " ")
      let textAnnotations = ocr.textAnnotations
      textAnnotations.shift()
      this.setState({ textAnnotations: textAnnotations })
    } catch (error) {
      console.log(error);
    }
  }




  onMouseDown(i) {
    if (!this.props.selectMode) return
    console.log(this.state.textAnnotations[i])
    let word = this.state.textAnnotations[i].description
    let symbols = Canvas.state.currentSymbols
    let words = Object.keys(symbols)
    if (words.includes(word)) {
      delete symbols[word]
    } else {
      symbols[word] = 0
    }
    Canvas.setState({ symbols: symbols })
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
    let currentSymbols = Canvas.state.currentSymbols
    return (
      <>
        <Text
          text={ `Selected Variables: ${ JSON.stringify(currentSymbols) }` }
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
          if (Object.keys(currentSymbols).includes(word)) color = App.highlightColorAlpha
          if (this.state.currentId === i) color = App.highlightColorAlpha

          if (this.props.selectMode) {
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
          } else if (Object.keys(currentSymbols).includes(word)) {
            return (
              <Variable
                key={ i }
                x={ x }
                y={ y }
                width={ width }
                height={ height }
                word={ word }
                value={ currentSymbols[word] }
              />
            )
          } else {
            return (
              <></>
            )
          }
        })}
      </>
    )
  }
}

export default Words