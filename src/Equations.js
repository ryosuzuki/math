import React, { Component } from 'react'
import { Group, Rect } from 'react-konva'
import Equation from './Equation.js'
import Slider from './Slider.js'

import mathPixEquations from './equations.json'

class Equations extends Component {
  constructor(props) {
    super(props)
    window.Equations = this
    this.state = {
      equations: [],
    }
  }

  componentDidMount() {

    // const url2 = `${App.domain}/public/sample/mathpix-${App.sampleId}.json`
    // this.fetchData2(url2)
    this.init()
  }

  async init() {
    const url = `${App.domain}/public/sample/math-${App.sampleId}.json`
    let equations = await this.fetchData(url)
    window.mathocr = equations

    const url2 = `${App.domain}/public/sample/mathpix-${App.sampleId}.md`
    let mathpix = await this.fetchData(url2)
    window.mathpix = mathpix

    equations = equations.filter(e => e.score > 0.6)
    equations = equations.map((equation) => {
      equation.x = equation.bbox[0][0]
      equation.y = equation.bbox[0][1]
      equation.width = equation.bbox[2][0] - equation.x
      equation.height = equation.bbox[2][1] - equation.y
      return equation
    })
    // TODO: hard-coded equation from mathpix.md
    const scores = mathPixEquations.map(i => i.score)
    for (let i = 0; i < equations.length; i++) {
      let equation = equations[i]
      let id = _.indexOf(scores, equation.score)
      if (mathPixEquations[i]) {
        equation.latex = mathPixEquations[i].latex
      }
      const equationRef = React.createRef()
      Canvas.equationRefs.push(equationRef)
      equations[i] = equation
    }

    let mathpixEquations = this.extractEquations(mathpix)
    console.log(mathpixEquations)

    // let box = mathocr[0].bbox
    let items = []
    for (let eq of mathocr) {
      let box = eq.bbox
      let bbox = { minX: box[0][0], maxX: box[2][0], minY: box[0][1], maxY: box[2][1] }
      let text = ''
      for (let textAnnotation of ocr.textAnnotations) {
        let description = textAnnotation.description
        let vertices = textAnnotation.boundingPoly.vertices
        let bb = { minX: vertices[0].x, maxX: vertices[2].x, minY: vertices[0].y, maxY: vertices[2].y }
        if ((bbox.minX <= bb.minX && bb.maxX <= bbox.maxX) && (bbox.minY <= bb.minY && bb.maxY <= bbox.maxY)) {
          text += description
        } else {
        }
      }
      items.push({ text: text, score: eq.score })
    }
    items = items.filter(item => item.score > 0.6)
    console.log(items)



    this.setState({ equations: equations })
    console.log('end 1')
  }

  async fetchData(url) {
    try {
      const response = await fetch(url)
      if (url.includes('json')) {
        return await response.json()
      } else {
        return await response.text()
      }
    } catch (error) {
      console.error(error);
    }
  }

  extractEquations(text) {
    const regex = /\$(.*?)\$/g;
    const equations = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      equations.push(match[1]);
    }
    return equations;
  }

  render() {
    return (
      <>
        { this.state.equations.map((equation, i) => {
          if (equation.score < 0.3) return <></>
          {/*if (i !== 4) return <></>*/}
          return (
            <Group key={i}>
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
              <Equation
                key={ `equation-${i}` }
                ref={ Canvas.equationRefs[i] }
                id={ i }
                x={ equation.x }
                y={ equation.y }
                width={ equation.width }
                height={ equation.height }
                latex={ equation.latex }
              />
            </Group>
          )
        })}
        <Slider />
      </>
    )
  }
}

export default Equations