import React, { Component } from 'react'
import { Rect, Path } from 'react-konva'

import { parseSync, stringify } from 'svgson'
import svgPathBbox from 'svg-path-bbox'

class Figure extends Component {
  constructor(props) {
    super(props)
    window.Figure = this
    this.state = {
      paths: [],
      bboxes: [],
    }
  }

  componentDidMount() {
    this.processLine()
    this.processContour()
  }

  async fetchData(url) {
    try {
      const response = await fetch(url)
      return response.text()
    } catch (error) {
      console.error(error);
    }
  }

  async processLine() {
    const url = `${App.domain}/public/sample/figure-line-${App.sampleId}.svg`
    let svgText = await this.fetchData(url)
    let svgJson = parseSync(svgText)
    let paths = svgJson.children
    paths = paths.filter((path) => path.attributes.d)
    this.setState({ paths: paths })
  }

  async processContour() {
    const url = `${App.domain}/public/sample/figure-contour-${App.sampleId}.svg`
    let svgText = await this.fetchData(url)
    let svgJson = parseSync(svgText)
    let paths = svgJson.children
    paths = paths.filter((path) => path.attributes.d)
    let bboxes = []
    for (let path of paths) {
      let bbox = svgPathBbox(path.attributes.d)
      let width = bbox[2] - bbox[0]
      let height = bbox[3] - bbox[1]
      if (width < 100 || height < 100) continue
      if (width > 1000 && height > 1000) continue
      bboxes.push(bbox)
    }
    this.setState({ bboxes: bboxes })
  }

  render() {
    return (
      <>
        { this.state.paths.map((path, i) => {
          return (
            <Path
              key={ i }
              data={ path.attributes.d }
              stroke={ App.highlightColor }
              strokeWidth={ 3 }
              visible={ true }
            />
          )
        })}

        { this.state.bboxes.map((bbox, i) => {
          return (
            <Rect
              key={ i }
              x={ bbox[0] }
              y={ bbox[1] }
              width={ bbox[2] - bbox[0] }
              height={ bbox[3] - bbox[1] }
              strokeWidth={ 3 }
              stroke={ App.strokeColor }
              fill={ App.fillColorAlpha }
            />
          )
        })}
      </>
    )
  }
}

export default Figure