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
