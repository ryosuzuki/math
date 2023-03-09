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
    console.log(id)
    if (!Canvas.state.selectMode) return
  }

  onMouseEnter(id) {
    // console.log(id)
    if (!Canvas.state.selectMode) return
    Equation.setState({ currentId: id })
  }

  onMouseLeave(id) {
    // console.log(id)
    if (!Canvas.state.selectMode) return
    Equation.setState({ currentId: null })
  }

  renderElement(element, id='root') {
    if (element.type === 'element') {
      const transformStr = element.attributes['transform']
      const transform = this.getTransform(transformStr)
      switch (element.name) {
        case 'g':
          const node = element.attributes['data-mml-node']
          if (node) id = `${id}-${node}`
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
          if (Equation.state.currentId === c) {
            color = App.highlightColor
            fill = App.highlightColorAlpha
          }
          return (
            <>
              <Path
                key={ `path-${id}` }
                x={ transform.translate.x }
                y={ transform.translate.y }
                className={ id }
                data={ d }
                fill={ color }
              />
              <Rect
                key={ `bbox-${id}` }
                x={ bbox[0] - offset/2 }
                y={ bbox[1] - offset/2 }
                width={ bbox[2] - bbox[0] + offset }
                height={ bbox[3] - bbox[1] + offset }
                fill={ fill }
                onMouseDown={ this.onMouseDown.bind(this, c) }
                onMouseEnter={ this.onMouseEnter.bind(this, c) }
                onMouseLeave={ this.onMouseLeave.bind(this, c) }
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
          { this.renderElement(this.state.latexElements, this.props.id) }
        </Group>
      </>
    )
  }
}

export default Latex