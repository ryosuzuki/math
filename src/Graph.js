import React, { useState } from 'react'
import { Mafs, Coordinates, Circle, Text, Plot, useMovablePoint, vec } from "mafs";

function Graph() {
  const pointOnCircle = useMovablePoint([
    Math.sqrt(2) / 2,
    Math.sqrt(2) / 2,
  ])
  const r = vec.mag(pointOnCircle.point)

  return (
    <>
      <Mafs
        zoom={{ min: 0.1, max: 2 }}
        viewBox={{
          x: [-2, 2],
          y: [-2, 2],
          padding: 0,
        }}
      >
        <Coordinates.Cartesian subdivisions={1} />
        <Plot.OfX y={(x) => Math.sin(x)} />
        <Circle center={[0, 0]} radius={r} />
        {pointOnCircle.element}
        <Text x={1.1} y={0.1} attach="ne">
          Oh hi! afeoj
        </Text>
      </Mafs>
    </>
  )
}

export default Graph

// import React, { Component } from 'react'
// import { Mafs, Coordinates, Circle, Text, Plot, useMovablePoint, vec } from "mafs";


// class Graph extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       pointOnCircle: null
//     }
//   }

//   componentDidMount() {

//     const pointOnCircle = useMovablePoint([
//       Math.sqrt(2) / 2,
//       Math.sqrt(2) / 2,
//     ])
//     const r = vec.mag(pointOnCircle.point)
//     this.setState({ pointOnCircle: pointOnCircle })
//   }

//   render() {
//     return (
//       <>
//         <Mafs
//           zoom={{ min: 0.1, max: 2 }}
//           viewBox={{
//             x: [-2, 2],
//             y: [-2, 2],
//             padding: 0,
//           }}
//         >
//         <Coordinates.Cartesian subdivisions={5} />
//         <Plot.OfX y={(x) => Math.sin(x)} />
//         <Circle center={[0, 0]} radius={1} />
//         {this.state.pointOnCircle && this.state.pointOnCircle.element}
//         <Text x={1.1} y={0.1} attach="ne">
//           Oh hi! afeoj
//         </Text>
//         </Mafs>
//       </>
//     )
//   }
// }

// export default Graph