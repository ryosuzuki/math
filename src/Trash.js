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


import React, { Component } from 'react'
import { Group, Path, Rect, Text } from 'react-konva'
import svgPathBbox from 'svg-path-bbox'

class Symbol extends Component {
  constructor(props) {
    super(props)
    window.Symbol = this
    this.state = {
      arrowVisible: false,
      currentX: -1000,
      currentY: -1000,
      currentValue: 0,
      highlight: false,
    }
  }

  componentDidMount() {
  }

  onMouseDown() {
    if (!Canvas.state.selectMode) return
    let id = this.props.symbolId
    let symbols = Canvas.state.currentSymbols
    // if (id.includes('mi')) {
    //   id = 'mi-' + id.split('-mi-')[1]
    // }
    let ids = Object.keys(symbols)
    console.log(id, ids)
    if (ids.includes(id)) {
      // delete symbols[id]
    } else {
      symbols[id] = 0
    }
    Canvas.setState({ symbols: symbols })
    this.setState({ highlight: true })
  }

  onMouseEnter() {
    let id = this.props.symbolId
    if (id.includes('mo')) return
    if (Canvas.state.selectMode) {
      Equations.setState({ currentId: id })
      this.setState({ highlight: true })
    }
  }

  onMouseLeave() {
    let id = this.props.symbolId
    if (Canvas.state.selectMode) {
      Equations.setState({ currentId: null })
      this.setState({ highlight: false })
    }
  }

  onDragStart(event) {
    if (Canvas.state.selectMode) return false
    const pos = App.state.mouse
    this.originValue = this.props.value
    this.originX = pos.x
    this.originY = pos.y
    Slider.setState({ arrowVisible: true, originX: this.originX, originY: this.originY })
  }

  onDragMove(event) {
    if (Canvas.state.selectMode) return false
    const target = event.target
    target.x(this.props.bbox.x)
    target.y(this.props.bbox.y)
    const pos = App.state.mouse
    Slider.setState({ currentX: pos.x, currentY: this.originY })

    let dx = pos.x - this.originX
    dx = dx / 10
    console.log(pos, dx)

    return false
    let hash = {}
    hash[this.props.word] = this.originValue + dx
    let round = this.props.word === '²' ? 0 : 1
    // let round = 1
    Canvas.updateValue(hash, round)
  }

  onDragEnd(event) {
    Slider.setState({ arrowVisible: false })
  }

  render() {
    let fill = 'rgba(0, 0, 0, 0)'
    if (this.props.selected) fill = App.highlightColorAlpha
    if (this.state.highlight) fill = App.fillColorAlpha
    return (
      <>
        <Path
          y={ this.props.transform.translate.y }
          className={ this.props.symbolId }
          data={ this.props.pathData }
          fill={ 'black' }
        />
        <Rect
          x={ this.props.bbox.x }
          y={ this.props.bbox.y }
          width={ this.props.bbox.width }
          height={ this.props.bbox.height }
          fill={ fill }
          draggable
          onDragStart={ this.onDragStart.bind(this)}
          onDragMove={ this.onDragMove.bind(this) }
          onDragEnd={ this.onDragEnd.bind(this) }
          onMouseDown={ this.onMouseDown.bind(this) }
          onMouseEnter={ this.onMouseEnter.bind(this) }
          onMouseLeave={ this.onMouseLeave.bind(this) }
        />
      </>
    )
  }
}

export default Symbol



/* Old code to get ratio */
/*
init() {
  let points = []
  for (let x = -3; x < 3; x += 0.01) {
    let answer = evaluateTex(this.state.equation, { x: x });
    let y = answer.evaluated
    points.push({ x: x, y: y })
  }
  let graphBounding = this.state.graphBounding
  let xs = points.map(point => point.x)
  let ys = points.map(point => point.y)
  let bounding = { minX: _.min(xs), maxX: _.max(xs), minY: _.min(ys), maxY: _.max(ys) }
  let xRatio = (graphBounding.maxX - graphBounding.minX) / (bounding.maxX - bounding.minX)
  let yRatio = - (graphBounding.maxY - graphBounding.minY) / (bounding.maxY - bounding.minY)
  let ratio = { x: xRatio, y: yRatio }
  this.setState({ graphBounding: graphBounding, ratio: ratio, points: points })
}
*/





    // const eq1 = '-48.5*b = sqrt(a) - 2';
    // const eq2 = '-1.5*b = sqrt(97*a) - 2';
    // const expr1 = math.parse(eq1);
    // const expr2 = math.parse(eq2);
    // const simplified1 = math.simplify(eq1);
    // const simplified2 = math.simplify(eq2);



    // const variables = ['a', 'b'];
    // const expr2 = math.parse(eq2);
    // const scope = { a: null, b: null };
    //  const compiled1 = expr1.compile();
    // const compiled2 = expr2.compile();
    // const solveForA = (bValue) => {
    //   scope.b = bValue;
    //   return compiled1.evaluate(scope);
    // }
    // const solveForB = (aValue) => {
    //   scope.a = aValue;
    //   return compiled2.evaluate(scope);
    // }









    // const eq1 = '-48.5*b == sqrt(a) - 2';
    // const eq2 = '-1.5*b == sqrt(97*a) - 2';
    // const simplified1 = math.simplify(eq1);
    // const simplified2 = math.simplify(eq2);
    // const variables = ['a', 'b'];
    // // const solutions = math.solve([simplified1, simplified2], variables);


    // const parsed1 = math.parse(eq1);
    // const parsed2 = math.parse(eq2);
    // // const simplified1 = parsed1.simplify();
    // // const simplified2 = parsed2.simplify();
    // const solutions = math.evaluate(`solve([${simplified1}, ${simplified2}], ${JSON.stringify(variables)})`);



    // let xRatios = []
    // for (let point of points) {
    //   let answer = evaluateTex('x = (y + 2)^2', { y: point.y });
    //   let x = answer.evaluated
    //   console.log(x)
    //   let xRatio =  point.x / x
    //   xRatios.push(xRatio)
    // }

    // console.log(points)
    // let xRatios = []
    // for (let point of points) {
    //   let answer = evaluateTex(this.state.equation, { y: point.y })
    //   let x = answer.evaluated
    //   let xRatio = point.x / x
    //   xRatios.push(xRatio)
    // }
    // console.log(xRatios)
    // console.log(yRatios)
    // let xRatio = _.mean(xRatios)
    // let yRatio = _.mean(yRatios)

import React, { Component } from 'react'
import { Line, Text } from 'react-konva'
import { parseTex, evaluateTex } from 'tex-math-parser'
import * as math from 'mathjs';

class Graph extends Component {
  constructor(props) {
    super(props)
    window.Graph = this
    this.state = {
      equation: 'x^2',
      points: [],
      ratio: { x: 0, y: 0 },
      variables: { a: -3, b: 1 }
    }
    this.state.equation = this.props.equation
    // console.log(this.props.ratio)
    this.state.ratio = this.props.ratio
  }

  componentDidMount() {
    this.update(this.state.equation)
  }

  onDragStart(event) {
    const target = event.target
    this.originPos = App.state.mouse
    this.originSybmols = _.clone(Canvas.state.currentSymbols)
  }

  onDragMove(event) {
    const target = event.target
    target.x(0)
    target.y(0)
    let pos = App.state.mouse
    let delta = { x: pos.x - this.originPos.x, y: pos.y - this.originPos.y }
    let a = this.originSybmols['3']
    let b = this.originSybmols['1']
    let hash = {}
    if (!isNaN(a)) {
      hash['3'] = a - delta.x / this.state.ratio.x
    }
    if (!isNaN(b)) {
      hash['1'] = b + delta.y / this.state.ratio.y
    }
    let round = 1
    Canvas.updateValue(hash, round)
  }

  onDragEnd(event) {
  }

  updateValue() {
    let symbols = Canvas.state.currentSymbols
    let a = -symbols['3'] || -3
    let b = symbols['1'] || 1
    let c = symbols['²'] || 2
    let str = `y = ( x - ${a})^{${c}} + ${b}`
    this.update(str)
  }

  update(equation) {
    try {
      let points = []
      for (let x = -10; x < 10; x += 0.05) {
        let answer = evaluateTex(equation, { x: x });
        let y = answer.evaluated
        points.push({ x: x, y: y })
      }
      this.setState({ equation: equation, points: points })
    } catch (err) {
      console.error(err)
    }
  }

  getRatio() {
    window.math = math

    try {
      let points = this.props.segments.map((segment) => { return { x: segment[1], y: segment[2] } })
      window.points = points

      let p1 = points[0]
      let p2 = _.last(points)

      if (!p1 || !p2) return
      let x1 = p1.x - this.props.origin.x
      let y1 = this.props.origin.y - p1.y
      let x2 = p2.x - this.props.origin.x
      let y2 = this.props.origin.y - p2.y

      const data = { equation: this.state.equation, x1: x1, y1: y1, x2: x2, y2: y2 }
      console.log('emit sympy ' + JSON.stringify(data))
      App.socket.emit('sympy', data)
    } catch (err) {
      console.error(err)
    }

    App.socket.on('sympy', (json) => {
      console.log(json)
      json = JSON.parse(json)
      if (!json.x || !json.y) return

      let xRatio = Number(json.x)
      let yRatio = Number(json.y)
      let ratio = { x: xRatio, y: -yRatio }
      console.log(ratio)
      this.setState({ ratio: ratio })
      this.update(this.state.equation)
    })
  }

  convert(points) {
    let offset = 50
    let linePoints = []
    for (let point of points) {
      let x = point.x * this.state.ratio.x + this.props.origin.x
      let y = point.y * -this.state.ratio.y + this.props.origin.y
      if (isNaN(x) || isNaN(y)) continue
      if (x < this.props.xAxis[0] - offset || this.props.xAxis[2] + offset < x) continue
      if (y < this.props.yAxis[1] - offset || this.props.xAxis[3] + offset < y) continue
      linePoints.push(x, y)
    }
    return linePoints
  }

  render() {
    return (
      <>
        <Line
          x={ 0 }
          y={ 0 }
          points={ this.convert(this.state.points) }
          stroke={ App.strokeColor }
          strokeWidth={ 4 }
          draggable
          onDragStart={this.onDragStart.bind(this) }
          onDragMove={this.onDragMove.bind(this) }
          onDragEnd={this.onDragEnd.bind(this) }
        />
        {/*
        <Text
          x={ 967 }
          y={ 1000 }
          text={ this.state.equation }
          fontSize={ 20 }
          fill={ '#ee00ab' }
          width={ 300 }
          height={ 30 }
          offsetX={ 300/2 }
          offsetY={ 30 }
          align='center'
          verticalAlign='middle'
        />
        */}
      </>
    )
  }
}

export default Graph


this.ratios = [
  { x: 25.66064861813475, y: 26.905709982731338 }, // 0
  { x: 29.245847176079735, y: 29.669850016473006}, // 1
  { x: 25.66064861813475, y: 26.905709982731338 }, // 2 x
  { x: 29.245847176079735, y: 29.669850016473006}, // 3 x
  { x: 25.66064861813475, y: 26.905709982731338 }, // 4 x
  { x: 29.245847176079735, y: 29.669850016473006}, // 5 x
  { x: 29.245847176079735, y: 29.669850016473006}, // 6 x
  { x: 25.9444824525229, y: 28.036916408186016},   // 7
  { x: 25.9444824525229, y: 28.036916408186016},   // 8 x
  { x: 25.9444824525229, y: 28.036916408186016},   // 9 x
]

this.state.equations = [
  'y = \\sqrt{x} - 2',
  'y = \\sqrt{x - 2}',
  'y = - \\sqrt{x}',
  'y = \\sqrt{-x}',
  'y = \\sqrt{x}',
  'y = 2 \\sqrt{x}',
  'y = x^2',
  'y = (x + 3)^2 + 1',
  'y = \\sin(x)',
  'y = \\sin(2x)',
]
