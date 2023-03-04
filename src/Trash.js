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
