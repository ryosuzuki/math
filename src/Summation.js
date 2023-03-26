import { useState, useEffect } from "react";
import { Group, Rect, Text } from "react-konva";

/**
 * Summation Component
 */
export default function Summation(props) {
  const { currentSymbols } = props;
  const { n } = currentSymbols; // This is the symbol that will update the summations for now
  const [ocr, setOcr] = useState([]);
  const [summations, setSummations] = useState([]);

  // Get the OCR and Equation box results on dom mount
  useEffect(() => {
    async function getData() {
      let url = `${App.domain}/public/sample/ocr-${App.sampleId}.json`;
      console.log(url);
      await fetchOCR(url);
    }
    getData();
  }, []);

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
      setOcr(textAnnotations);
      return textAnnotations;
    } catch (error) {
      console.log(error);
    }
  }

  // Functions to call once ocr data is loaded
  useEffect(() => {
    if (ocr.length > 0) {
      //console.log(ocr);
      getSummations();
    }
  }, [ocr]);

  /**
   * Functions in here get called whenever n is updated
   */
  useEffect(() => {
    updateSummations(n);
  }, [n]);

  // Find all symbols with E (sigma) x
  // Get n value from canvas symbols, round down to closest integer x
  // Get the expression of the summation (It should be the symbol to the right of it (AKA index of E + 1))
  // For each summation draw a rectangle on Konva that covers the expression
  // Create a function that return the sum as a string aka (i + i1 + ... i100)
  // Put the text over the rectangle
  // Later on each summation should have their own n symbol

  /**
   * Gets all of the sigma symbols and their expressions
   */
  const getSummations = () => {
    // Get each symbol that is a summation
    ocr.forEach((symbol, index) => {
      if (symbol.description === "Σ") {
        let sigma = symbol;
        sigma.expression = ocr[index + 1];
        setSummations([...summations, sigma]);
      }
    });
  };

  /**
   * Updates summations when n is changed
   */
  const updateSummations = (n) => {
    // Getting the summation string for each summation
    const newSummations = summations;
    newSummations.forEach((summation) => {
      summation.summationString = createSummationString(
        summation.expression.description,
        n
      );
    });
    setSummations(newSummations);
  };

  /**
   * Creates a summation string given n and the expression
   * Assuming that i is the loop variable in sigma
   * @param {*} expression
   * @param {*} n
   */
  const createSummationString = (expression, n) => {
    const i = "ᵢ";
    let expression_halves = expression.split("i");
    n = Math.abs(Math.floor(n));
    let equation = "";
    if (n <= 8) {
      for (let z = 1; z <= n; z++) {
        equation +=
          expression_halves[0] + z.toString() + expression_halves[1] + " + ";
      }
      return equation.substring(0, equation.length - 2);
    } else {
      for (let z = 1; z <= 6; z++) {
        equation +=
          expression_halves[0] + z.toString() + expression_halves[1] + " + ";
      }
      equation += "... + ";
      equation += expression_halves[0] + n.toString() + expression_halves[1];
      return equation;
    }
  };
  // Find all symbols with E

  return (
    <>
      {summations.map((summation, index) => {
        const { vertices } = summation.expression.boundingPoly;
        return (
          <Group x={vertices[0].x - 5} y={vertices[0].y} key={index}>
            <Rect
              width={(vertices[2].x - vertices[0].x) * 20}
              height={vertices[2].y - vertices[0].y}
              fill={"white"}
            />
            <Text
              y={(vertices[2].y - vertices[0].y) / 4}
              text={
                summation.summationString === undefined ||
                summation.summationString === ""
                  ? summation.expression.description
                  : summation.summationString
              }
              fontSize={20}
            />
          </Group>
        );
      })}
    </>
  );
}
