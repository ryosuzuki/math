import React, { Component } from 'react'
import { Group, Rect, Path } from 'react-konva'
import TeXToSVG from 'tex-to-svg'
import { parseSync, stringify } from 'svgson'

class Latex extends Component {
  constructor(props) {
    super(props)
    window.Latex = this
    this.state = {
      latex: '',
      latexElements: [],
      latexDefs: {},
    }
  }

  componentDidMount() {
    window.TeXToSVG = TeXToSVG
    let latex = this.props.latex // 'y=x^2+6x+10=(x+3)^2+1'
    const options = { width: 300 }
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

  renderElement(element) {
    if (element.type === 'element') {
      const transformStr = element.attributes['transform']
      const transform = this.getTransform(transformStr)
      switch (element.name) {
        case 'g':
          const node = element.attributes['data-mml-node']
          return (
            <Group
              x={ transform.translate.x }
              y={ transform.translate.y }
              scaleX={ transform.scale.x }
              scaleY={ transform.scale.y }
            >
              { element.children.map(this.renderElement.bind(this)) }
            </Group>
          )
        case 'use':
          const id = element.attributes['xlink:href']
          const data = this.state.latexDefs[id]
          const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`
          return (
            <Path
              x={ transform.translate.x }
              y={ transform.translate.y }
              data={ data }
              fill={ `black` }
            />
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
          x={ this.props.x }
          y={ this.props.y }
          width={ this.props.width }
          height={ this.props.height }
          fill={ 'white' }
          stroke={ 'black' }
          strokeWidth={ 3 }
        />
        <Group
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