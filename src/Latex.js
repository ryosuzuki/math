import React, { Component } from 'react'
import { Group, Rect, Path } from 'react-konva'
import TeXToSVG from 'tex-to-svg'
import { parseSync, stringify } from 'svgson'
import svgPathBbox from 'svg-path-bbox'

class Latex extends Component {
  constructor(props) {
    super(props)
    window.Latex = this
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

  onMouseDown(id) {
    if (!Canvas.state.selectMode) return
    let symbols = Canvas.state.currentSymbols
    if (id.includes('mi')) {
      id = 'mi-' + id.split('-mi-')[1]
    }
    let ids = Object.keys(symbols)
    console.log(id, ids)
    if (ids.includes(id)) {
      // delete symbols[id]
    } else {
      symbols[id] = 0
    }
    Canvas.setState({ symbols: symbols })
  }

  onMouseEnter(id) {
    // console.log(id)
    if (id.includes('mo')) return
    if (!Canvas.state.selectMode) return
    Equation.setState({ currentId: id })
  }

  onMouseLeave(id) {
    // console.log(id)
    if (!Canvas.state.selectMode) return
    Equation.setState({ currentId: null })
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
          const d = this.state.latexDefs[href]
          const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`
          const bbox = svgPathBbox(d)
          let offset = 500
          id = `${id}-${c}`
          let color = 'black'
          let fill = 'rgba(0, 0, 0, 0)'
          /*
            mi: [x, y], mo: [+, =, ()], mn: [1, 2, 3], msup: [^2]
            1D466: y, 1D465: x, ...
            30: 0, 31: 1, 32: 2, ...
            - x^2 = msup-mi-1D465, msup-mn-32
            - 10  = mn-31-30
            - \sqrt{x} = msqrt-mo-221A, msqrt-mi-1D465
          */
          let highligh = false
          const currentId = Equation.state.currentId
          if (currentId === id) highligh = true
          if (currentId && id.includes('mi') && id.split('-mi-')[1] === currentId.split('-mi-')[1]) highligh = true

          let symbols = Canvas.state.currentSymbols
          let sids = Object.keys(symbols)
          // console.log(sid)
          for (let sid of sids) {
            if (id.includes(sid)) highligh = true
          }
          if (highligh) {
            color = App.highlightColor
            fill = App.highlightColorAlpha
          }
          return (
            <>
              <Path
                key={ `path-${this.props.id}-${id}` }
                x={ transform.translate.x }
                y={ transform.translate.y }
                className={ id }
                data={ d }
                fill={ color }
              />
              <Rect
                key={ `bbox-${this.props.id}-${id}` }
                x={ bbox[0] - offset/2 }
                y={ bbox[1] - offset/2 }
                width={ bbox[2] - bbox[0] + offset }
                height={ bbox[3] - bbox[1] + offset }
                fill={ fill }
                onMouseDown={ this.onMouseDown.bind(this, id) }
                onMouseEnter={ this.onMouseEnter.bind(this, id) }
                onMouseLeave={ this.onMouseLeave.bind(this, id) }
              />
            </>
          )
        default:
          return null
      }
    }
    return null
  }


  render() {
    return (
      <>
        <Rect
          key={ `bbox-${this.props.id}` }
          x={ this.props.x }
          y={ this.props.y }
          width={ this.props.width }
          height={ this.props.height }
          fill={ 'white' }
          stroke={ 'black' }
          strokeWidth={ 3 }
        />
        <Group
          key={ `group-${this.props.id}` }
          x={ this.props.x + 10 }
          y={ this.props.y + 20 }
          scaleX={ 0.02 }
          scaleY={ 0.02 }
        >
          { this.renderElement(this.state.latexElements) }
        </Group>
      </>
    )
  }
}

export default Latex