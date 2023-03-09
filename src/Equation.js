import React, { Component } from 'react'
import { Rect } from 'react-konva'
import Latex from './Latex.js'

class Equation extends Component {
  constructor(props) {
    super(props)
    window.Equation = this
    this.state = {
      equations: [],
      currentId: null,
    }
  }

  componentDidMount() {
    const url = `${App.domain}/public/sample/math-${App.sampleId}.json`
    this.fetchData(url)
  }

  async fetchData(url) {
    try {
      const response = await fetch(url)
      let equations = await response.json()
      equations = equations.filter(e => e.score > 0.6)
      equations = equations.map((equation) => {
        equation.x = equation.bbox[0][0]
        equation.y = equation.bbox[0][1]
        equation.width = equation.bbox[2][0] - equation.x
        equation.height = equation.bbox[2][1] - equation.y
        return equation
      })
      // TODO: hard-coded equation from mathpix.md
      for (let i = 0; i < equations.length; i++) {
        let equation = equations[i]
        if (equation.score === 0.8239156603813171) {
          equation.latex = 'y=x^{2}+6 x+10=(x+3)^{2}+1'
        }
        if (equation.score === 0.8157801628112793) {
          equation.latex = 'y=x^{2}'
        }
        if (equation.score === 0.8349450826644897) {
          equation.latex = 'y=x^{2}'
        }
        if (equation.score === 0.728001058101654) {
          equation.latex = 'y=\\sqrt{x}-2'
        }
        if (equation.score === 0.7760927677154541) {
          equation.latex = 'f(x)=x^{2}+6 x+10'
        }
        if (equation.score === 0.665852427482605) {
          equation.latex = 'y=\\sqrt{x}'
        }
        if (equation.score === 0.6306443810462952) {
          equation.latex = 'y=\\sqrt{x-2}'
        }
        if (equation.score === 0.6169342994689941) {
          equation.latex = 'y=(x+3)^{2}+1'
        }
        if (equation.score === 0.6046971082687378) {
          equation.latex = 'y=1-\\sin x'
        }
        equations[i] = equation
      }
      this.setState({ equations: equations })
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <>
        { this.state.equations.map((equation, i) => {
          if (equation.score < 0.3) return <></>
          return (
            <>
              <Rect
                key={ `equation-rect-${i}` }
                x={ equation.x }
                y={ equation.y }
                width={ equation.width }
                height={ equation.height }
                fill={ equation.type === 'embedding' ? App.fillColorAlpha : App.highlightColorAlpha }
                stroke={ App.strokeColor }
                strokeWidth={ 3 }
              />
              <Latex
                key={ `latex-${i}` }
                id={ i }
                x={ equation.x }
                y={ equation.y }
                width={ equation.width }
                height={ equation.height }
                latex={ equation.latex }
              />
            </>
          )
        })}
      </>
    )
  }
}

export default Equation