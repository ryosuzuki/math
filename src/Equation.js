import React, { Component } from 'react'
import { Group, Rect, Path } from 'react-konva'
import texToSVG from 'tex-to-svg'
import svgson from 'svgson'
import svgPathBbox from 'svg-path-bbox'

import parseSvg from 'parse-svg-path'
import serializeSvg from 'serialize-svg-path'
import translateSvg from 'translate-svg-path'
import scaleSvg from 'scale-svg-path'

import Symbol from './Symbol.js'

class Equation extends Component {
  constructor(props) {
    super(props)
    window.Equation = this
    this.state = {
      symbols: [],
      rects: [],
      highlight: false,
      graph: null
    }
  }

  componentDidMount() {
    window.texToSVG = texToSVG
    let latex = this.props.latex // 'y=x^2+6x+10=(x+3)^2+1'
    const options = { width: 100 }
    let svgText = texToSVG(latex, options)
    this.svgText = svgText
    let latexJson = svgson.parseSync(svgText)
    this.latexJson = latexJson
    let latexElements = latexJson.children[1]
    let paths = latexJson.children[0].children
    let latexDefs = {}
    for (let path of paths) {
      latexDefs[`#${path.attributes.id}`] = path.attributes.d
    }
    this.latexDefs = latexDefs
    this.getElement(latexElements)
  }

  getTransform(transformStr) {
    let scale = { x: 1, y: 1 }
    let translate = { x: 0, y: 0, }
    if (!transformStr) return { scale: scale, translate: translate }
    for (let value of transformStr.split(' ')) {
      let [type, data] = value.split('(');
      if (!data) {
        [type, data] = transformStr.split('(')
        // console.log(transformStr, type, data)
      }
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

  getSymbol(element, prev) {
    const transformStr = element.attributes['transform']
    const transform = this.getTransform(transformStr)
    const tag = element.attributes['data-c']
    const href = element.attributes['xlink:href']
    const pathData = this.latexDefs[href]
    const symbolId = `${prev.id}-${tag}`
    const transforms =  _.clone(prev.transforms)
    transforms.push(transform)
    // const tag = symbolId.split('math-')[1]

    let path = parseSvg(pathData)
    for (let transform of transforms) {
      path = parseSvg(serializeSvg(scaleSvg(path, transform.scale.x, transform.scale.y)))
    }
    for (let transform of transforms) {
      path = parseSvg(serializeSvg(translateSvg(path, transform.translate.x, transform.translate.y)))
    }
    path = parseSvg(serializeSvg(scaleSvg(path, 0.02, -0.02)))
    // path = parseSvg(serializeSvg(translateSvg(path, this.props.x + 10, this.props.y + 20 )))
    path = parseSvg(serializeSvg(translateSvg(path, this.props.x + 5, this.props.y + this.props.height/2 )))
    path = serializeSvg(path)

    const box = svgPathBbox(path)
    const offset = 5
    const bbox = {
      x: box[0] - offset/2,
      y: box[1] - offset/2,
      width: box[2] - box[0] + offset,
      height: box[3] - box[1] + offset,
    }
    const center = { x: bbox.x + bbox.width/2, y: bbox.y + bbox.height/2 }
    const symbol = {
      id: symbolId,
      tag: tag,
      equationId: this.props.id,
      pathData: path,
      path: parseSvg(path),
      bbox: bbox,
      center: center,
      color: App.highlightColor,
      transforms: _.clone(transforms),
    }
    return symbol
  }

  combineSymbols(symbols) {
    let combinedSymbol = _.clone(symbols[0])
    combinedSymbol.id = combinedSymbol.id.split(`-${symbols[0].tag}`)[0] + '-' + symbols.map(symbol => symbol.tag).join('-')
    combinedSymbol.tag = symbols.map(symbol => symbol.tag).join('-')
    combinedSymbol.pathData = symbols.map(symbol => symbol.pathData).join(' ')
    combinedSymbol.path = parseSvg(combinedSymbol.pathData)
    const box = svgPathBbox(combinedSymbol.pathData)
    const offset = 5
    const bbox = {
      x: box[0] - offset/2,
      y: box[1] - offset/2,
      width: box[2] - box[0] + offset,
      height: box[3] - box[1] + offset,
    }
    combinedSymbol.bbox = bbox
    const center = { x: bbox.x + bbox.width/2, y: bbox.y + bbox.height/2 }
    combinedSymbol.center = center
    return combinedSymbol
  }

  getRect(element, prev) {
    const transforms =  _.clone(prev.transforms)
    const scale = 0.02
    let x = Number(element.attributes['x'])
    let y = -Number(element.attributes['y'])
    let width = Number(element.attributes['width'])
    let height = Number(element.attributes['height'])
    for (let transform of transforms) {
      x += transform.translate.x
      y -= transform.translate.y
    }
    x *= scale
    y *= scale
    width *= scale
    height *= scale
    x += 5
    y += this.props.height/2
    const rect = { x: x, y: y, width: width, height: height }
    return rect
  }

  getElement(element, prev) {
    if (element.type === 'element') {
      const transformStr = element.attributes['transform']
      const transform = this.getTransform(transformStr)
      let transforms = []
      switch (element.name) {
        case 'g':
          const node = element.attributes['data-mml-node']
          let id = this.props.id
          if (node) {
            id = !prev ? `${this.props.id}-${node}` : `${prev.id}-${node}`
          }
          if (node === 'TeXAtom') {
            id = prev.id
          }
          if (prev) {
            transforms = _.clone(prev.transforms)
            transforms.push(transform)
          }
          prev = { id: id, transforms: transforms }

          if (['mi', 'mn', 'mo'].includes(node)) {
            const symbols = []
            for (let child of element.children) {
              const symbol = this.getSymbol.bind(this)(child, _.clone(prev))
              symbols.push(symbol)
            }
            let symbol = symbols[0]
            if (symbols.length > 1) {
              symbol = this.combineSymbols(symbols)
            }
            if (symbol.pathData === '') break

            // console.log(symbol)
            const ascii = Canvas.convertAscii(symbol.tag)
            Canvas.symbolHash[symbol.tag] = ascii

            const temp = this.state.symbols
            temp.push(symbol)
            this.setState({ symbols: temp })
          } else {
            for (let child of element.children) {
              this.getElement.bind(this)(child, _.clone(prev))
            }
          }
          break
        case 'rect':
          const temp = this.state.rects
          const rect = this.getRect.bind(this)(element, _.clone(prev))
          temp.push(rect)
          this.setState({ rects: temp })
          break
        default:
          break
      }
    }
  }

  onMouseDown() {
    if (Graphs.state.selectId === -1) return
    const selectId = Graphs.state.selectId
    const graph = Canvas.graphRefs[selectId].current
    graph.setState({ equation: this })
    graph.update(this.props.latex)
    this.setState({ highlight: false, graph: graph })
    Graphs.setState({ selectId: -1 })
  }

  onMouseEnter() {
    if (!Canvas.state.selectMode) return
    if (Graphs.state.selectId === -1) return
    this.setState({ highlight: true })
  }

  onMouseLeave() {
    if (!Canvas.state.selectMode) return
    if (Graphs.state.selectId === -1) return
    this.setState({ highlight: false })
  }

  render() {
    let stroke = '#eee'
    // stroke = 'black'
    let fill = 'white'
    if (this.state.highlight) {
      stroke = App.fillColor
      fill = App.fillColorBackground
    }
    if (this.state.graph) {
      stroke = App.highlightColor
      fill = App.highlightColorBackground
    }
    return (
      <>
        <Rect
          key={ `bbox-${this.props.id}` }
          x={ this.props.x }
          y={ this.props.y }
          width={ this.props.width }
          height={ this.props.height }
          fill={ fill }
          stroke={ stroke }
          strokeWidth={ 3 }
          onMouseDown={ this.onMouseDown.bind(this) }
          onMouseEnter={ this.onMouseEnter.bind(this) }
          onMouseLeave={ this.onMouseLeave.bind(this) }
        />
        {/* Symbols such as x, y, 1, 2, \sin */}
        { this.state.symbols.map((symbol, i) => {
          return (
            <Symbol
              key={ i }
              id={ symbol.id }
              tag={ symbol.tag }
              equationId={ this.props.id }
              pathData={ symbol.pathData }
              path={ symbol.path }
              bbox={ symbol.bbox }
              center={ symbol.center }
              transforms={ symbol.transforms }
            />
          )
        }) }
        {/* Lines for \frac or \sqrt */}
        { this.state.rects.map((rect, i) => {
          return (
            <Rect
              key={ i }
              x={ this.props.x + rect.x }
              y={ this.props.y + rect.y }
              width={ rect.width }
              height={ rect.height }
              fill={ 'black' }
            />
          )
        }) }
      </>
    )
  }
}

export default Equation