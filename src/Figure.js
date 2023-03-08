import React, { Component } from 'react'
import { Rect, Path } from 'react-konva'

// import { pathParse, serializePath } from 'svg-path-parse'
import { parseSync, stringify } from 'svgson'
import svgPathBbox from 'svg-path-bbox'
// import svg from '!raw-loader!!./figure-1.svg'
// import { svgPathProperties } from 'svg-path-properties'

class Figure extends Component {
  constructor(props) {
    super(props)
    window.Figure = this
    this.state = {
      paths: [],
      bbox: { minX: 0, minY: 0, maxX: 0, maxY: 0 }
    }
  }

  componentDidMount() {
    const url = `${App.domain}/public/sample/figure-${App.sampleId}.svg`
    this.fetchData(url)
  }

  async fetchData(url) {
    try {
      const response = await fetch(url)
      const svgText = await response.text()
      this.process(svgText)
    } catch (error) {
      console.error(error);
    }
  }

  process(svgText) {
    // console.log(svg)
    let svgJson = parseSync(svgText)
    window.svgText = svgText
    window.svgJson = svgJson
    let paths = []

    for (let i = 0; i < svgJson.children.length; i++) {
      let path = svgJson.children[i]
      let d = path.attributes.d
      console.log(path)
      if (!d) continue
      let bbox = svgPathBbox(d)
      path.bbox = bbox
      let rect = {
        x: bbox[0],
        y: bbox[1],
        width: bbox[2] - bbox[0],
        height: bbox[3] - bbox[1]
      }
      path.rect = rect
      // let properties = new svgPathProperties(d)
      // path.length = properties.getTotalLength()
      paths.push(path)
    }

    let minX = _.min(paths.map((path) => path.bbox[0]))
    let minY = _.min(paths.map((path) => path.bbox[1]))
    let maxX = _.max(paths.map((path) => path.bbox[2]))
    let maxY = _.max(paths.map((path) => path.bbox[3]))
    let bbox = { minX: minX, minY: minY, maxX: maxX, maxY: maxY }
    this.setState({ paths: paths })
    // this.graphRef.current.setState({ axisBounding: bbox })
  }

  render() {
    return (
      <>
        {/*
        <Rect
          x={ this.state.bbox.minX }
          y={ this.state.bbox.minY }
          width={ this.state.bbox.maxX - this.state.bbox.minX }
          height={ this.state.bbox.maxY - this.state.bbox.minY }
          strokeWidth={ App.strokeWidth }
          stroke={ App.highlightColor }
        />
        */}

        { this.state.paths.map((path, i) => {
          return (
            <>
              <Path
                key={ i }
                data={ path.attributes.d }
                stroke={ App.highlightColor }
                strokeWidth={ 3 }
              />
              <Rect
                x={ path.bbox[0] }
                y={ path.bbox[1] }
                width={ path.bbox[2] - path.bbox[0] }
                height={ path.bbox[3] - path.bbox[1] }
                strokeWidth={ 3 }
                stroke={ App.strokeColor }
              />
            </>
          )
        })}
      </>
    )
  }
}

export default Figure