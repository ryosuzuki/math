import React, { Component } from 'react'
import { Rect } from 'react-konva'

class Equation extends Component {
  constructor(props) {
    super(props)
    window.Equation = this
    this.state = {
      equations: []
    }
  }

  componentDidMount() {
    const url = `${App.domain}/public/sample/math-${App.sampleId}.json`
    this.fetchData(url)
  }

  async fetchData(url) {
    try {
      const response = await fetch(url)
      const equations = await response.json()
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
            <Rect
              key={ i }
              x={ equation.bbox[0][0] }
              y={ equation.bbox[0][1] }
              width={ equation.bbox[2][0] - equation.bbox[0][0] }
              height={ equation.bbox[2][1] - equation.bbox[0][1] }
              fill={ equation.type === 'embedding' ? App.fillColorAlpha : App.highlightColorAlpha }
              stroke={ App.strokeColor }
              strokeWidth={ 3 }
            />
          )
        })}
      </>
    )
  }
}

export default Equation