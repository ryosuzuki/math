import React, { useState } from 'react'
import { Mafs, Coordinates, Circle, Text, Plot, useMovablePoint, vec } from 'mafs'

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