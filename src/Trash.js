import coreCSSContent from '!!raw-loader!mafs/core.css'
import fontCSSContent from '!!raw-loader!mafs/font.css'
import appCSSContent from '!!raw-loader!./App.css'
import mafsCSSContent from '!!raw-loader!./Mafs.css'

class Trash extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mafsImage: null,
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.embedMafs()
    }, 100)
  }

  init() {
    console.log('init')
    let el = document.querySelector('#drawing-plane')
    let mesh = el.object3D.children[0]
    let konvaEl = document.querySelector('.konvajs-content canvas')
    // konvaEl.width = konvaEl.height = this.size
    console.log(konvaEl)
    let texture = new THREE.CanvasTexture(konvaEl)
    let material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1,
      alphaTest: 0.1,
    })
    mesh.material = material
    this.mesh = mesh
    el.sceneEl.addEventListener('mousedown', this.mouseDown.bind(this))
    el.sceneEl.addEventListener('mousemove', this.mouseMove.bind(this))
    el.sceneEl.addEventListener('mouseup', this.mouseUp.bind(this))
    el.sceneEl.addEventListener('touchstart', this.touchStart.bind(this))
    el.sceneEl.addEventListener('touchmove', this.touchMove.bind(this))
    el.sceneEl.addEventListener('touchend', this.touchEnd.bind(this))
  }

  embedMafs() {
    const cssContent = `${coreCSSContent}\n${fontCSSContent}\n${appCSSContent.toString()}\n${mafsCSSContent}`;
    let svgElement = document.querySelector('.MafsView svg')
    const styleElement = document.createElementNS("http://www.w3.org/2000/svg", "style");
    svgElement.setAttribute('id', 'mafs-embed')
    styleElement.textContent = cssContent
    svgElement.appendChild(styleElement)

    console.log(svgElement)
    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(svgElement)
    const mafsImage = new window.Image()
    mafsImage.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
    mafsImage.onload = () => {
      this.setState({ mafsImage: mafsImage })
    }
  }

}



import React, { Component } from 'react'
import { Group, Circle } from 'react-konva'

import Variable from './Variable.js'
import _ from 'lodash'

class MathCircle extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.origin = { x: 687, y: 400 }
  }

  componentDidMount() {
  }

  onDragMove(event) {
    let pos = App.state.mouse
    let h = pos.x - this.origin.x
    let k = this.origin.y - pos.y
    Canvas.updateValue({ h: h, k: k })
  }

  onDragMoveRadius(event) {
    let pos = App.state.mouse
    let currentSymbols = Canvas.state.currentSymbols
    let h = currentSymbols['h']
    let k = currentSymbols['k']
    let center = { x: this.origin.x + h, y: this.origin.y - k }
    const dx = center.x - pos.x
    const dy = center.y - pos.y
    const radius = Math.sqrt(dx**2 + dy**2)
    Canvas.updateValue({ r: radius })
  }

  render() {
    let currentSymbols = Canvas.state.currentSymbols
    if (!_.has(currentSymbols, 'h') || !_.has(currentSymbols, 'k') || !_.has(currentSymbols, 'r')) {
      return <></>
    }
    let radius = currentSymbols['r']
    let h = currentSymbols['h']
    let k = currentSymbols['k']
    let center = { x: this.origin.x + h, y: this.origin.y - k }
    return (
      <>
        <Circle
          x={ center.x }
          y={ center.y }
          radius={ radius }
          strokeWidth={ App.strokeWidth }
          stroke={ App.strokeColor }
          fill={ App.fillColorAlpha }
          draggable
          onDragMove={this.onDragMove.bind(this) }
        />
        <Circle
          x={ center.x }
          y={ center.y }
          radius={ 3 }
          fill={ App.highlightColor }
        />
        <Circle
          x={ center.x + radius * Math.sin(Math.PI/4) }
          y={ center.y - radius * Math.sin(Math.PI/4) }
          radius={ 10 }
          fill={ App.highlightColor }
          draggable
          onDragMove={this.onDragMoveRadius.bind(this) }
        />
      </>
    )
  }
}

export default MathCircle


import React, { Component } from 'react'
import { Group, Line, Circle } from 'react-konva'

class MathSine extends Component {
  constructor(props) {
    super(props)
    this.state = {
      x: 300,
      y: 300,
      dx: 0,
      dy: 0,
      points: [],
      width: 1500,
      height: 1200,
      amplitude: 50,
      frequency: 0.1,
    }
  }

  componentDidMount() {
    this.draw()
  }

  draw() {
    const points = [];
    for (let x = -this.state.width/2; x <= this.state.width/2; x += 5) {
      const y = this.state.amplitude * Math.sin(this.state.frequency * x) - this.state.height/2
      points.push(x, this.state.height / 2 + y);
    }
    this.setState({ points: points })
  }

  handleDragMove(event) {
    const x = event.evt.clientX
    const y = event.evt.clientY
    const dx = x - this.state.x
    const dy = y - this.state.y
    this.setState({ dx: dx, dy: 0 })
  }

  handleDragMove2(event) {
    let x = event.evt.clientX
    let dx = x - this.state.x
    let frequency = 2*Math.PI / dx
    this.setState({ frequency: frequency })
    this.draw()
  }

  horizontalDragBound(pos) {
    return { x: pos.x, y: this.state.y }
  }

  verticalDragBound(pos) {
    return { x: this.state.x, y: pos.y }
  }

  render() {
    return (
      <>
        <Group
          x={ this.state.x }
          y={ this.state.y }
          width={ 500 }
          height={ 200 }
          draggable
        >
          <Line
            x={ this.state.dx }
            y={ 0 }
            points={ this.state.points }
            stroke={ App.strokeColor }
            strokeWidth={ App.strokeWidth }
          />
          <Circle
            x={ 0 }
            y={ 0 }
            radius={ 10 }
            fill={ '#ee00ab' }
            visible={ true }
            draggable
            dragBoundFunc={this.horizontalDragBound.bind(this)}
            onDragMove={this.handleDragMove.bind(this)}
          />
          <Circle
            x={ 2*Math.PI / this.state.frequency }
            y={ 0 }
            radius={ 10 }
            fill={ '#ee00ab' }
            visible={ true }
            draggable
            dragBoundFunc={this.horizontalDragBound.bind(this)}
            onDragMove={this.handleDragMove2.bind(this)}
          />
        </Group>
      </>
    )
  }
}

export default MathSine


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
      let transforms = []
      switch (element.name) {
        case 'g':
          const node = element.attributes['data-mml-node']
          let id = this.props.id
          if (node) {
            if (!prev) {
              id = `${this.props.id}-${node}`
            } else {
              id = `${prev.id}-${node}`
            }
          }
          if (node === 'TeXAtom') {
            id = prev.id
          }
          if (prev) {
            transforms = _.clone(prev.transforms)
            transforms.push(transform)
          }
          prev = { id: id, transforms: transforms }
          for (let child of element.children) {
            this.getElement.bind(this)(child, _.clone(prev))
          }
          break
        case 'use':
          const c = element.attributes['data-c']
          const href = element.attributes['xlink:href']
          const pathData = this.latexDefs[href]
          const symbolId = `${prev.id}-${c}`
          transforms = prev.transforms
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
            // path = parse(serialize(scale(path, transform.scale.x, transform.scale.y)))
            path = parse(serialize(translate(path, transform.translate.x, transform.translate.y)))
          }
          // console.log(_.clone(transforms))
          path = parse(serialize(scale(path, 0.02, -0.02)))
          // offset.x = this.props.width / 2
          // offset.y = this.props.height / 2
          path = parse(serialize(translate(path, this.props.x + 10, this.props.y + 20 )))
          path = serialize(path)
          const symbol = {
            id: symbolId,
            pathData: path,
            path: parse(path),
            bbox: bbox,
            color: App.highlightColor,
            transforms: _.clone(transforms),

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
      </>
    )
  }
}

export default Equation