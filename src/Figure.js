import React, { Component } from 'react'
import { Rect, Path } from 'react-konva'

import { parseSync, stringify } from 'svgson'
import svgPathBbox from 'svg-path-bbox'

class Figure extends Component {
  constructor(props) {
    super(props)
    window.Figure = this
    this.state = {
      currentId: -1,
      lines: [],
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
    let lines = svgJson.children
    lines = lines.filter((line) => line.attributes.d)
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i]
      let bbox = svgPathBbox(line.attributes.d)
      line.bbox = bbox
      line.visible = false
      lines[i] = line
    }
    this.setState({ lines: lines })
  }

  async processContour() {
    const url = `${App.domain}/public/sample/figure-contour-${App.sampleId}.svg`
    let svgText = await this.fetchData(url)
    let svgJson = parseSync(svgText)
    let contours = svgJson.children
    contours = contours.filter((contour) => contour.attributes.d)
    let bboxes = []
    for (let i = 0; i < contours.length; i++) {
      let path = contours[i]
      let bbox = svgPathBbox(path.attributes.d)
      let width = bbox[2] - bbox[0]
      let height = bbox[3] - bbox[1]
      if (width < 100 || height < 100) continue
      if (width > 1000 && height > 1000) continue
      bboxes.push(bbox)
    }
    this.setState({ bboxes: bboxes })
  }

  onMouseDown(i) {
    let bbox = this.state.bboxes[i]
    let lines = this.state.lines
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i]
      if (line.bbox[0] < bbox[0] || line.bbox[1] < bbox[1] || line.bbox[2] > bbox[2] || line.bbox[3] > bbox[3]) {
        line.visible = false
      } else {
        line.visible = true
      }
    }
  }

  onMouseEnter(i) {
    if (!this.props.selectMode) return
    this.setState({ currentId: i })
  }

  onMouseLeave(i) {
    if (!this.props.selectMode) return
    this.setState({ currentId: -1 })
  }

  render() {
    return (
      <>
        { this.state.lines.map((line, i) => {
          return (
            <Path
              key={ i }
              data={ line.attributes.d }
              stroke={ App.highlightColor }
              strokeWidth={ 3 }
              visible={ line.visible }
            />
          )
        })}

        { this.state.bboxes.map((bbox, i) => {
          let stroke = 'rgba(0, 0, 0, 0)'
          let fill = 'rgba(0, 0, 0, 0)'
          if (this.state.currentId === i) {
            stroke = App.strokeColor
            fill = App.fillColorAlpha
          }
          return (
            <Rect
              key={ i }
              x={ bbox[0] }
              y={ bbox[1] }
              width={ bbox[2] - bbox[0] }
              height={ bbox[3] - bbox[1] }
              strokeWidth={ 3 }
              stroke={ stroke }
              fill={ fill }
              onMouseDown={ this.onMouseDown.bind(this, i) }
              onMouseEnter={ this.onMouseEnter.bind(this, i) }
              onMouseLeave={ this.onMouseLeave.bind(this, i) }
            />
          )
        })}
      </>
    )
  }
}

export default Figure