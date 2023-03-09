import React, { Component } from 'react'
import { Stage, Layer, Group, Rect, Text, Path } from 'react-konva'
import katex from 'katex'
import TeXToSVG from 'tex-to-svg'
import { parseSync, stringify } from 'svgson'
import { Html } from 'react-konva-utils';
import { parse } from 'transform-parser'

class Equation extends Component {
  constructor(props) {
    super(props)
    window.Equation = this
    this.state = {
      equations: [],
      svgElements: [],
      svgDefs: {},
    }
  }

  componentDidMount() {
    const url = `${App.domain}/public/sample/math-${App.sampleId}.json`
    this.fetchData(url)

    window.TeXToSVG = TeXToSVG
    let equation = 'y = x^2 + 6x + 10 = (x+3)^2 + 1'
    const options = { width: 309 }
    let svgText = TeXToSVG(equation, options)
    let svgJson = parseSync(svgText)
    let elements = svgJson.children[1]
    let paths = svgJson.children[0].children
    let defs = {}
    for (let path of paths) {
      defs[`#${path.attributes.id}`] = path.attributes.d
    }
    // svgJson.defs = defs
    // elements.defs = defs
    // const svg = { elements: elements, defs: defs }
    this.setState({ svgElements: elements, svgDefs: defs  })

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
    const katexHtml = { __html: katex.renderToString('c = \\pm\\sqrt{a^2 + b^2}') };

    const getPathData = (element) => {
      if (element.name === 'path') {
        return element.attributes.d;
      }
      return ''
    }

    const getTransform = (transformStr) => {
      let scale = { x: 1, y: 1 }
      let translate = { x: 0, y: 0, }
      if (!transformStr) return { scale: scale, translate: translate }
      for (let value of transformStr.split(' ')) {
        const [type, data] = value.split('(');
        const values = data.substring(0, data.length - 1).split(',')
        if (type === 'scale') {
          if (values.length === 1) values.push(values[0])
          scale = {
            x: parseFloat(values[0]),
            y: parseFloat(values[1])
          }
        } else if (type === 'translate') {
          translate = {
            x: parseFloat(values[0]),
            y: parseFloat(values[1])
          }
        }
      }
      return { scale: scale, translate: translate }
    }

    const renderElement = (element) => {
      if (element.type === 'element') {
        switch (element.name) {
          case 'g':
            const node = element.attributes['data-mml-node']
            const transformStr = element.attributes['transform']
            const transform = getTransform(transformStr)
            console.log(transform)
            return (
              <Group
                x={ transform.translate.x }
                y={ transform.translate.y }
                scaleX={ transform.scale.x }
                scaleY={ transform.scale.y }
              >
                { element.children.map(renderElement) }
              </Group>
            )
          case 'use':
            const id = element.attributes['xlink:href']
            const data = this.state.svgDefs[id]
            return (
              <Path
                x={ 0 }
                y={ 0 }
                data={ data }
                fill={ 'black' }
              />
            )
          default:
            return null
        }
      }
      return null
    }


    return (
      <>
        <Group x={ 300 } y={ 300 } scaleX={ 0.05 } scaleY={ 0.05 }>
          { renderElement(this.state.svgElements) }
        </Group>

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