import React, { Component } from 'react'
import { Mafs, Coordinates, Circle, Text } from "mafs";

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
        <div id="hoge">
          <Mafs
            zoom={{ min: 0.1, max: 2 }}
            viewBox={{
              x: [-2, 2],
              y: [-2, 2],
              padding: 0,
            }}
          >
          <Coordinates.Cartesian subdivisions={5} />
          <Circle center={[0, 0]} radius={1} />
          <Text x={1.1} y={0.1} attach="ne">
            Oh hi!
          </Text>
          </Mafs>
        </div>
      </>
    )
  }
}

export default Graph