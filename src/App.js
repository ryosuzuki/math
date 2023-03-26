import React, { Component } from 'react'
import './App.css'
import { io } from 'socket.io-client'
import Canvas from './Canvas.js'

AFRAME.registerComponent('drawing-plane', {
  init: () => {},
  tick: () => {}
})

let isCameraOn = false

class App extends Component {
  constructor(props) {
    super(props)
    window.app = this
    window.App = this

    /*
    Demo-1:
    - y = (x + 3)^2 + 1
    - y = \sin(2x)
    - y = x^2 + 6x + 10
    Demo-2:
    - (x-h)^2 + (y-k)^2 = r^2
    - x^2 - 4x + y^2 + 6y - 12 = 0
    Demo-4:
    - P(x) = ax^2 + bx + c
    - P(x) = 2x^6 - x^4 + 2/5x^3 + \sqrt(2)
    - y = x^3 - x + 1
    - y = x^4 - 3x^2 + x
    - y = 3x^5 - 25x^3 + 60x
    Demo-6:
    - f(x) = 2x - 1
    - g(x) = x^2
    - f(x) = 2x^2 - 5x + 1
    - f(a+h) = 2(a+h)^2 - 5(a+h) + 1 = 2a^2 + 4ah + 2h^2 - 5a - 5h + 1
    - (f(a+h) - f(a))/h = 4a + 2h - 5
    */
    this.sampleId = 2
    this.threshold = 0.5
    if (this.sampleId === 6) this.threshold = 0.4
    if (this.sampleId === 7) this.threshold = 0.3
    this.domain = 'https://raw.githubusercontent.com/ryosuzuki/math/main'

    if (window.location.href.includes('localhost')) {
      this.socket = io('http://localhost:4000')
      this.domain = 'http://localhost:4000'
    }
    this.size = 1500 // 1024
    this.dragging = false
    this.initDrawing = true
    this.state = {
      distance: 0,
      mouse2D: { x: 0, y: 0 },
      mouse: { x: 0, y: 0 },
      raycaster: new THREE.Raycaster(),
    }
    this.strokeColor = '#002f2b'
    this.fillColor = '#004842'
    this.fillColorAlpha = 'rgba(0, 28, 26, 0.3)'
    this.highlightColor = '#ee00ab'
    this.highlightColorAlpha = 'rgba(238, 0, 171, 0.3)'
    this.strokeWidth = 8
    this.canvasRef = React.createRef()
  }

  componentDidMount() {
    this.sceneEl = document.querySelector('a-scene')
    this.sceneEl.renderer = new THREE.WebGLRenderer({ alpha: true })
    this.sceneEl.addEventListener('loaded', () => {
      this.init()
      AFRAME.components['drawing-plane'].Component.prototype.tick = this.tick.bind(this)
    })
  }

  init() {
    console.log('init')
    let el = document.querySelector('#drawing-plane')
    let mesh = el.object3D.children[0]
    let konvaEl = document.querySelector('.konvajs-content canvas')
    // konvaEl.width = konvaEl.height = this.size
    let texture = new THREE.CanvasTexture(konvaEl)
    let material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
    mesh.material = material
    this.mesh = mesh
    el.sceneEl.addEventListener('mousedown', this.mouseDown.bind(this))
    el.sceneEl.addEventListener('mousemove', this.mouseMove.bind(this))
    el.sceneEl.addEventListener('mouseup', this.mouseUp.bind(this))
    el.sceneEl.addEventListener('touchstart', this.touchStart.bind(this))
    el.sceneEl.addEventListener('touchmove', this.touchMove.bind(this))
    el.sceneEl.addEventListener('touchend', this.touchEnd.bind(this))
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
    const screenPositionX = this.state.mouse2D.x / window.innerWidth * 2 - 1
    const screenPositionY = this.state.mouse2D.y / window.innerHeight * 2 - 1
    const screenPosition = new THREE.Vector2(screenPositionX, -screenPositionY)

    let camera = document.getElementById('camera')
    let threeCamera = camera.getObject3D('camera')
    this.state.raycaster.setFromCamera(screenPosition, threeCamera)
    const intersects = this.state.raycaster.intersectObject(this.mesh, true)
    if (intersects.length > 0) {
      const intersect = intersects[0]
      let point = intersect.point
      let mouse = {
        x: this.size * intersect.uv.x,
        y: this.size * (1- intersect.uv.y)
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

  render() {
    return (
      <>
        <Canvas ref={this.canvasRef} />
        <img id='paper' src={ `${this.domain}/public/sample/sample-${this.sampleId}.jpg` } crossOrigin='anonymous' style={{ display: 'none' }} />
        { isCameraOn ? '' :
          <a-scene>
            <a-camera id="camera" position="0 1.5 -0.4" look-controls="enabled: false" raycaster="objects: .cantap" cursor="fuse: false; rayOrigin: mouse;"></a-camera>
            <a-plane drawing-plane id="drawing-plane" class="cantap" position="0 1.5 -1" width="1" height="1" color="#ccc" opacity="0">
            </a-plane>
          </a-scene>
        }
        { !isCameraOn ? '' :
          <a-scene
            mindar-image={ `imageTargetSrc: ${this.domain}/public/target.mind` }
            embedded color-space="sRGB"
            renderer="colorManagement: true, physicallyCorrectLights"
            vr-mode-ui="enabled: false"
            device-orientation-permission-ui="enabled: false"
          >
            <a-camera id="camera" position="0 0 0" look-controls="enabled: false" raycaster="objects: .cantap" cursor="fuse: false; rayOrigin: mouse;"></a-camera>
            <a-entity mindar-image-target="targetIndex: 0">
              <a-plane drawing-plane id="drawing-plane" class="cantap" position="0 0 0" width="1" height="1" color="#ccc" opacity="0">
              </a-plane>
            </a-entity>
          </a-scene>
        }
      </>
    )
  }
}

export default App