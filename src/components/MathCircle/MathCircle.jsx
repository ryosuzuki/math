import "../Mafs.css"
import "./MathCircle.css"
import {
  Mafs,
  Circle,
  Coordinates,
  useMovablePoint,
  vec,
  Transform,
} from "mafs";

function MathCircle() {
  const originPoint = useMovablePoint([0, 0]); // h = index 0, k = index 1
  const pointOnCircle = useMovablePoint([1, 1]);
  const r = vec.mag(pointOnCircle.point); // [1,1] in the beginning but it changes when you move the point

  return (
    <div className="container">
      <Mafs>
        <Coordinates.Cartesian />
        <Transform translate={originPoint.point}>
          <Transform scale={r}>
            <Circle center={[0, 0]} radius={1} />
          </Transform>
          {pointOnCircle.element}
        </Transform>
        {originPoint.element}
      </Mafs>
      <div id="equation-container">
        <h2>
          Equation:<i>r = SQRT((x-h)^2 + (y-k)^2)</i>
        </h2>
        <h2>
          <i>
            {r} = sqrt(({pointOnCircle.x}-{originPoint.x})^2 + (
            {pointOnCircle.y}-{originPoint.y})^2)
          </i>
        </h2>
      </div>
    </div>
  );
}

export default MathCircle;
