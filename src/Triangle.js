import { useEffect, useRef, useState } from "react";
import { Circle, RegularPolygon, Shape } from "react-konva";

export default function Triangle(props) {
  const { onTriangleChange, currentSymbols } = props;
  const a = currentSymbols["a²"];
  const b = currentSymbols["b²"];
  const c = currentSymbols["c²"];
  const factor = 1000;
  const [ac, setAc] = useState({ x: 745.9437976751877, y: 251.44354809191896 });
  const [cb, setCb] = useState({ x: 958.8450315383213, y: 118.99917586310744 });
  const [ab, setAb] = useState({ x: 958.8450315383213, y: 250.20575022062053 });
  const [update, setUpdate] = useState(0);
  const acRef = useRef();
  const cbRef = useRef();

  // Updates the current symbols
  useEffect(() => {
    let new_symbols = {
      "a²": Math.floor(((ab.x - ac.x) ** 2 + (ab.y - ac.y) ** 2) / factor),
      "b²": Math.floor(((ab.x - cb.x) ** 2 + (ab.y - cb.y) ** 2) / factor),
      "c²": Math.floor(((cb.x - ac.x) ** 2 + (cb.y - ac.y) ** 2) / factor),
    };
    onTriangleChange({ ...currentSymbols, ...new_symbols });
  }, [update]);

  // Whenever a or b is changed
  useEffect(() => {
    if (a !== undefined && b !== undefined && c !== undefined) {
      if (a > 0 && b > 0 && c > 0) {
        setCb({ x: cb.x, y: ab.y - Math.sqrt(b * factor) });
        setAc({ x: ab.x - Math.sqrt(a * factor), y: ac.y });
        // Update c in the current symbols
        let new_symbols = currentSymbols;
        new_symbols["c²"] = Math.floor(
          ((cb.x - ac.x) ** 2 + (cb.y - ac.y) ** 2) / factor
        );
      }
    }
  }, [a, b]);

  return (
    <>
      <Shape
        sceneFunc={(context, shape) => {
          context.beginPath();
          context.moveTo(ac.x, ac.y);
          context.lineTo(cb.x, cb.y);
          context.lineTo(ab.x, ab.y);
          context.lineTo(ac.x, ac.y);
          context.closePath();
          context.fillStrokeShape(shape);
        }}
        fill={App.highlightColorAlpha}
        stroke="black"
      />
      <Circle
        id="ac"
        radius={5}
        fill="black"
        stroke="black"
        x={ac.x}
        y={ac.y}
        draggable
        ref={acRef}
        onDragMove={(e) => {
          //console.log(e);
          acRef.current.attrs.y = ac.y;
          setAc({ x: e.target.attrs.x, y: ac.y });
          setUpdate(update + 1);
        }}
      />
      <Circle
        id="cb"
        radius={5}
        fill="black"
        stroke="black"
        x={cb.x}
        y={cb.y}
        draggable
        ref={cbRef}
        onDragMove={(e) => {
          //console.log(e);
          cbRef.current.attrs.x = cb.x;
          setCb({ x: cb.x, y: e.target.attrs.y });
          setUpdate(update + 1);
        }}
      />
    </>
  );
}
