import React, { Component } from 'react'
import { Group, Rect, Path } from 'react-konva'
import TeXToSVG from 'tex-to-svg'
import { parseSync, stringify } from 'svgson'
import svgPathBbox from 'svg-path-bbox'

import Symbol from './Symbol.js'

class Equation extends Component {
  constructor(props) {
    super(props)
    window.Equation = this
    this.state = {
      latex: '',
      latexElements: [],
      latexDefs: {},
      currentId: null
    }
    this.id = 0
  }

  componentDidMount() {
    window.TeXToSVG = TeXToSVG
    let latex = this.props.latex // 'y=x^2+6x+10=(x+3)^2+1'
    const options = { width: 100 }
    let svgText = TeXToSVG(latex, options)
    let latexJson = parseSync(svgText)
    let latexElements = latexJson.children[1]
    let paths = latexJson.children[0].children
    let latexDefs = {}
    for (let path of paths) {
      latexDefs[`#${path.attributes.id}`] = path.attributes.d
    }
    this.setState({ latexElements: latexElements, latexDefs: latexDefs  })
  }

  getTransform(transformStr) {
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

  renderElement(element, id) {
    if (element.type === 'element') {
      const transformStr = element.attributes['transform']
      const transform = this.getTransform(transformStr)
      switch (element.name) {
        case 'g':
          const node = element.attributes['data-mml-node']
          if (node && node !== 'TeXAtom') {
            id = id ? `${id}-${node}` : node
          }
          return (
            <Group
              x={ transform.translate.x }
              y={ transform.translate.y }
              scaleX={ transform.scale.x }
              scaleY={ transform.scale.y }
            >
              { element.children.map((child) => {
                return this.renderElement.bind(this)(child, id)
              })}
            </Group>
          )
        case 'use':
          const c = element.attributes['data-c']
          const href = element.attributes['xlink:href']
          const pathData = this.state.latexDefs[href]
          const symbolId = `${id}-${c}`
          const box = svgPathBbox(pathData)
          const offset = 500
          const bbox = {
            x: box[0] - offset/2,
            y: box[1] - offset/2,
            width: box[2] - box[0] + offset,
            height: box[3] - box[1] + offset,
          }
          let symbols = Canvas.state.currentSymbols
          let sids = Object.keys(symbols)
          let selected = false
          for (let sid of sids) {
            if (symbolId.includes(sid)) selected = true
          }
          return (
            <Symbol
              symbolId={ symbolId }
              equationId={ Equations.state.currentId }
              pathData={ pathData }
              bbox={ bbox }
              transform={ transform }
              selected={ selected }
            />
          )
        default:
          return null
      }
    }
    return null
  }

  render() {
    const scale = 0.02
    return (
      <>
        <Rect
          key={ `bbox-${this.props.id}` }
          x={ this.props.x }
          y={ this.props.y }
          width={ this.props.width }
          height={ this.props.height }
          fill={ 'white' }
          stroke={ 'white' }
          strokeWidth={ 3 }
        />
        <Group
          key={ `group-${this.props.id}` }
          x={ this.props.x + 10 }
          y={ this.props.y + 20 }
          scaleX={ scale }
          scaleY={ scale }
        >
          { this.renderElement(this.state.latexElements) }
        </Group>
      </>
    )
  }
}

export default Equation