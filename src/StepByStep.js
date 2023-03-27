import { useEffect, useState } from "react";
import mathsteps from "mathsteps";
import Steps from "./Steps.js";
import { Rect } from "react-konva";

/**
 * Step by Step component
 */
function StepByStep(props) {
  const [ocr, setOcr] = useState([]);
  const [equationBoxes, setEquationBoxes] = useState([]);
  const [equations, setEquations] = useState([]);
  const [stepsVisible, setStepsVisible] = useState(false);
  const [selectedEquation, setSelectedEquation] = useState();

  // Get the OCR and Equation box results on dom mount
  useEffect(() => {
    async function getData() {
      let url = `${App.domain}/public/sample/ocr-${App.fileId}.json`;
      await fetchOCR(url);
      url = `${App.domain}/public/sample/math-${App.fileId}.json`;
      await fetchEquations(url);
    }
    getData();
  }, []);

  // Call the get symbols function when data is loaded
  useEffect(() => {
    if (ocr.length > 0 && equationBoxes.length > 0) {
      getSolutions();
    }
  }, [ocr, equationBoxes]);

  /**
   * Gets OCR from url
   * @param {*} url
   */
  async function fetchOCR(url) {
    try {
      const response = await fetch(url);
      const jsonData = await response.json();
      const ocr = jsonData;
      let textAnnotations = ocr.textAnnotations;
      textAnnotations.shift();
      //console.log("ocr", textAnnotations);
      setOcr(textAnnotations);
      return textAnnotations;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Gets equation boxes from url
   * @param {*} url
   */
  async function fetchEquations(url) {
    try {
      const response = await fetch(url);
      let response_equations = await response.json();
      response_equations = response_equations.filter((eq) => {
        return eq.score > 0.3;
      });
      setEquationBoxes(response_equations);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Gets the solutions for each equation and updates the state
   */
  function getSolutions() {
    equationBoxes.forEach((equationBox) => {
      const { bbox } = equationBox;
      const equationYmin = bbox[0][1];
      const equationYmax = bbox[2][1];
      const equationXmin = bbox[0][0];
      const equationXmax = bbox[2][0];
      let equationString = "";

      ocr.forEach((symbol) => {
        const ocrYmin = symbol.boundingPoly.vertices[0].y;
        const ocrYmax = symbol.boundingPoly.vertices[2].y;
        const ocrXmin = symbol.boundingPoly.vertices[0].x;
        const ocrXmax = symbol.boundingPoly.vertices[2].x;
        // Checking if the symbol fits inside the bbox
        if (
          equationYmin - 5 < ocrYmin &&
          ocrYmax < equationYmax + 5 &&
          equationXmin - 5 < ocrXmin &&
          ocrXmax < equationXmax + 5
        ) {
          // Before we add the string, we need to proccess it a bit by removing commas
          let new_symbol = symbol.description.replace(/\,/g, "");

          new_symbol = symbol.description.replace(
            /[⁰¹²³⁴⁵⁶⁷⁸⁹]/g,
            (superChar) => {
              var result = "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(superChar);
              if (result > -1) {
                return `^${result}`;
              } else {
                return superChar;
              }
            }
          );
          equationString += new_symbol;
        }
      });

      // Now that we have the string, we can perform the math steps on the string.
      let equation_obj = {};
      equation_obj.bbox = bbox;
      equation_obj.solveSteps = [];
      equation_obj.equation = equationString;

      // We can either calculate the solve and simplify steps before hand for each equation or
      // let the user decide which one to do and caluclate it then (we are doing first option right now)
      /*
      const solveSteps = mathsteps.solveEquation(equationString);
      solveSteps.forEach((step) => {
        equation_obj.solveSteps.push({
          before_change: step.oldEquation.ascii(),
          change: step.changeType,
          after_change: step.newEquation.ascii(),
          num_substeps: step.substeps.length,
        });
      });
      */
      // Factor
      const solveSteps = mathsteps.solveEquation(equationString);
      solveSteps.forEach((step) => {
        equation_obj.solveSteps.push({
          beforeChange: step.oldEquation.ascii(),
          changeType: step.changeType,
          afterChange: step.newEquation.ascii(),
          substeps: step.substeps,
        });
      });
      if (equation_obj.solveSteps.length > 0) {
        equations.push(equation_obj);
      }

      /*
      equation_obj.solveSteps.push({
        beforeChange: "x",
        changeType: "NISHAN CHANGE",
        afterChange: "x",
        substeps: [
          {
            beforeChange: "x",
            changeType: "NISHAN CHANGE",
            newNode: "x",
            substeps: [],
          },
          {
            beforeChange: "x",
            changeType: "NISHAN CHANGE",
            newNode: "x",
            substeps: [],
          },
        ],
      });
      */

      /*
      equation_obj.solveSteps.push({
        beforeChange: "x",
        changeType: "NISHAN CHANGE TWO",
        afterChange: "x",
        substeps: [
          {
            beforeChange: "x",
            changeType: "NISHAN CHANGE",
            newNode: "x",
            substeps: [],
          },
          {
            beforeChange: "x",
            changeType: "NISHAN CHANGE",
            newNode: "x",
            substeps: [],
          },
        ],
      });
      */
    });

    setEquations(equations);
  }

  if (!App.state.selectMode && equations.length > 0) {
    return (
      <>
        {stepsVisible && selectedEquation !== undefined ? (
          <Steps
            equation_obj={selectedEquation}
            stepsVisible={stepsVisible}
            setStepsVisible={setStepsVisible}
          />
        ) : (
          equations.map((equation, index) => {
            const { bbox } = equation;
            return (
              <Rect
                x={bbox[0][0]}
                y={bbox[0][1]}
                width={bbox[2][0] - bbox[0][0]}
                height={bbox[2][1] - bbox[0][1]}
                transparent={true}
                onClick={() => {
                  setStepsVisible(true);
                  setSelectedEquation(equation);
                }}
                key={index}
              />
            );
          })
        )}
        <></>
      </>
    );
  }
  return null;
}

/* 
      {ocr.length > 0 &&
      equationBoxes.length > 0 &&
      equations.length > 0 &&
      selectMode === false
        ? equations.map((equation) => {
            return <Steps equation_obj={equation} />;
          })
        : null}*/
export default StepByStep;
