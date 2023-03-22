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