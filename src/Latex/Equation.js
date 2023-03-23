import React, { Component } from 'react'
import { Group, Rect, Path } from 'react-konva'
import TeXToSVG from 'tex-to-svg'
import { parseSync, stringify } from 'svgson'
import { pathParse, serializePath } from 'svg-path-parse'
import svgPathBbox from 'svg-path-bbox'

import parse from 'parse-svg-path'
import translate from 'translate-svg-path'
import scale from 'scale-svg-path'
import serialize from 'serialize-svg-path'

import Symbol from './Symbol.js'

class Equation extends Component {
  constructor(props) {
    super(props)
    window.Equation = this
    this.state = {
      latex: '',
      latexElements: [],
      latexDefs: {},
      currentId: null,
      symbols: []
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
    this.latexDefs = latexDefs
    this.getElement(latexElements)
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

  getElement(element, prev) {
    if (element.type === 'element') {
      const transformStr = element.attributes['transform']
      const transform = this.getTransform(transformStr)
      switch (element.name) {
        case 'g':
          const node = element.attributes['data-mml-node']
          if (node && node !== 'TeXAtom') {
            if (!prev) {
              prev = { id: `${this.props.id}-${node}`, transform: [] }
            } else {
              prev.id = `${prev.id}-${node}`
              prev.transform.push(transform)
            }
          }
          for (let child of element.children) {
            this.getElement.bind(this)(child, prev)
          }
          break
        case 'use':
          const c = element.attributes['data-c']
          const href = element.attributes['xlink:href']
          const pathData = this.latexDefs[href]
          const symbolId = `${prev.id}-${c}`
          const transforms = prev.transform
          transforms.push(transform)
          const box = svgPathBbox(pathData)
          const offset = 500
          const bbox = {
            x: box[0] - offset/2,
            y: box[1] - offset/2,
            width: box[2] - box[0] + offset,
            height: box[3] - box[1] + offset,
          }

          let path = parse(pathData)
          // path = parse(serialize(scale(path, s, -s)))
          for (let transform of transforms) {
            path = parse(serialize(translate(path, transform.translate.x, transform.translate.y)))
            path = parse(serialize(scale(path, transform.scale.x, transform.scale.y)))
          }
          console.log(transforms)
          path = parse(serialize(scale(path, 0.02, -0.02)))
          path = parse(serialize(translate(path, this.props.x, this.props.y)))
          path = serialize(path)
          const symbol = {
            id: symbolId,
            pathData: path,
            path: parse(path),
            bbox: bbox,
            color: App.highlightColor,
          }
          const symbols = this.state.symbols
          console.log(symbol)
          symbols.push(symbol)
          this.setState({ symbols: symbols })
          break
        default:
          break
      }
    }
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
        { this.state.symbols.map((symbol, i) => {
          return (
            <Path
              data={ symbol.pathData }
              x={ 0 }
              y={ 0 }
              fill={ symbol.color }
            />
          )
        })}

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