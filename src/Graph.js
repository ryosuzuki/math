import React, { Component } from 'react'
import { Mafs, Coordinates } from "mafs";

class Graph extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
  }

  render() {
    return (
      <>
        <Mafs>
          <Coordinates.Cartesian />
        </Mafs>
      </>
    )
  }
}

export default Graph