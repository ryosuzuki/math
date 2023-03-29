import React, { Component } from 'react'
import './App.css'
import Canvas from './Canvas.js'

class App extends Component {
  constructor(props) {
    super(props)
    window.app = this
    window.App = this

    const num = 10
    this.sampleIds = Array.from({length: num}, (_, i) => i+1)
    this.sampleId = parseInt(window.location.href.split('?id=')[1])
    if (isNaN(this.sampleId)) this.sampleId = 1
    this.fileId = this.sampleId.toString().padStart(2, '0')
    this.baseURL = window.location.origin

    this.threshold = 0.5
    if (this.sampleId === 6) this.threshold = 0.4
    if (this.sampleId === 7) this.threshold = 0.3
    if (this.sampleId === 8) this.threshold = 0.2
    if (this.sampleId === 10) this.threshold = 0.2
    this.domain = 'https://raw.githubusercontent.com/ryosuzuki/math/main'

    this.imageVisible = true
    if (window.location.href.includes('8thwall')) {
      this.imageVisible = false
    }

    if (window.location.href.includes('localhost')) {
      this.domain = 'http://localhost:4000'
    }
    this.size = 1500; // 1024
    this.dragging = false
    this.initDrawing = true
    this.state = {
      selectMode: true,
      distance: 0,
      mouse2D: { x: 0, y: 0 },
      mouse: { x: 0, y: 0 },
      raycaster: new THREE.Raycaster(),
    }
    this.strokeColor = '#002f2b'
    this.fillColor = '#004842'
    this.fillColorAlpha = 'rgba(0, 28, 26, 0.3)'
    this.fillColorBackground = '#b2baba'
    this.highlightColor = '#ee00ab'
    this.highlightColorAlpha = 'rgba(238, 0, 171, 0.3)'
    this.highlightColorBackground = '#fff0fb'
    this.strokeWidth = 8
    this.canvasRef = React.createRef()

    this.state.selectMode = false

  }

  componentDidMount() {
    this.sceneEl = document.querySelector('a-scene')
    // this.sceneEl.renderer = new THREE.WebGLRenderer({ alpha: true })
    this.init()
  }

  init() {
    console.log('init')
    let el = document.querySelector('#drawing-plane')
    let mesh = el.object3D.children[0]
    let konvaEl = document.querySelector('.konvajs-content canvas')
    // konvaEl.width = konvaEl.height = this.size
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

    AFRAME.components['drawing-plane'].Component.prototype.tick = this.tick.bind(this)
  }

  mouseDown(event) {
    this.dragging = true
  }

  mouseMove(event) {
    let mouse2D = { x: event.clientX, y: event.clientY }
    this.setState({ mouse2D: mouse2D })
  }

  mouseUp(event) {
    this.dragging = false
    this.initDrawing = true
    this.canvasRef.current.mouseUp(this.state.mouse)
  }

  touchStart(event) {
    this.dragging = true
    this.setState({ mouse2D: { x: 0, y: 0 } })
  }

  touchMove(event) {
    let mouse2D = { x: event.touches[0].clientX, y: event.touches[0].clientY }
    this.setState({ mouse2D: mouse2D })
  }

  touchEnd(event) {
    this.dragging = false
    this.initDrawing = true
    this.canvasRef.current.mouseUp()
  }

  tick() {
    this.mesh.material.map.needsUpdate = true
    const screenPositionX = (this.state.mouse2D.x / window.innerWidth) * 2 - 1
    const screenPositionY = (this.state.mouse2D.y / window.innerHeight) * 2 - 1
    const screenPosition = new THREE.Vector2(screenPositionX, -screenPositionY)

    let camera = document.getElementById('camera')
    if (!camera) return false
    let threeCamera = camera.getObject3D('camera')
    this.state.raycaster.setFromCamera(screenPosition, threeCamera)
    const intersects = this.state.raycaster.intersectObject(this.mesh, true)
    if (intersects.length > 0) {
      const intersect = intersects[0]
      let point = intersect.point
      let mouse = {
        x: this.size * intersect.uv.x,
        y: this.size * (1 - intersect.uv.y),
      }
      this.setState({ distance: intersect.distance, mouse: mouse })
      if (this.dragging) {
        if (this.initDrawing) {
          this.canvasRef.current.mouseDown(mouse)
          this.initDrawing = false
          console.log(this.initDrawing)
        } else {
          this.canvasRef.current.mouseDrag(mouse)
        }
      } else {
        this.canvasRef.current.mouseMove(mouse)
      }
    }
  }

  changeSample(sampleId) {
     window.location.href = `${this.baseURL}/math/?id=${sampleId}`
  }

  render() {
    return (
      <>
        <div id='buttons'>
          { this.sampleIds.map((sampleId, i) => {
            return (
              <button key={ `button-${i}` } onClick={ this.changeSample.bind(this, sampleId) }>
                { sampleId }
              </button>
            )
          }) }
          <button
            id='select'
            onClick={() =>
              this.setState({ selectMode: !this.state.selectMode })
            }
          >{`Select Mode: ${this.state.selectMode}`}</button>
        </div>
        <Canvas ref={this.canvasRef} />
        <img
          id='paper'
          src={`${this.domain}/public/sample/sample-${this.fileId}.jpg`}
          crossOrigin='anonymous'
          style={{ display: 'none' }}
        />
      </>
    )
  }
}

export default App
