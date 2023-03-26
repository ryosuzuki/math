import { Group, Rect, Text, Line } from "react-konva";

function Steps(props) {
  const { equation_obj, stepsVisible, setStepsVisible } = props;
  const { solveSteps } = equation_obj;

  // Defining dimensions for the steps box
  // X axis
  const size = App.size / 1.5;
  const minX = App.size / 6;
  const maxX = minX + size;
  const centerX = (minX + maxX) / 2;

  // Y axis
  const minY = App.size / 5;
  const maxY = minY + size;
  const centerY = (minY + maxY) / 2;

  // Other
  const marginX = 20;
  const marginY = 20;
  const top = minY + marginY; // This will be incremented as the lines will render
  const bottom = maxY - marginY;
  const left = minX + marginX;
  const right = maxX - marginX;

  let spaceBetweenSteps = 30;
  let spaceBetweenText = 0;
  let spaceBetweenSubSteps = 0;

  const substepFontSize = 22;
  const stepFontSize = 22;

  const stepByStepTop = top + 50;

  //const gheight = afterChangeOffset + 50;
  //let currentHeight = stepByStepTop - gheight;

  const step_by_step_margins = 15; // THE MARGINS BETWEEN EVERY ITEM IN STEP BY STEP

  //LINE OFFSET
  const lineOffset = stepFontSize + step_by_step_margins;

  // GROUP THAT CONTAINS STEP INFO
  const stepInfoYOffset = lineOffset + step_by_step_margins;
  const stepInfoXOffset = 30;

  const subStepYOffset = stepInfoYOffset + step_by_step_margins;
  const subStepXOffset = 15;
  const subStepChangeTypeOffset = subStepYOffset + step_by_step_margins;
  const substepAfterChangeOffset =
    subStepChangeTypeOffset + step_by_step_margins * 2;

  const subStepHeight = subStepChangeTypeOffset;
  let allSubStepsHeight = (subStepHeight * solveSteps[0].substeps.length) / 2;
  let stepHeight = lineOffset + stepInfoYOffset + allSubStepsHeight; // adding every offset from line offset to this variable

  return (
    <Group>
      {stepsVisible ? (
        /** This is the rectangle for the step by step solution */
        <>
          <Rect
            x={centerX}
            offsetX={size / 2}
            y={minY}
            width={size}
            height={size}
            fill="rgba(255,255,255,1)"
            stroke="#777"
            strokeWidth={1}
            cornerRadius={8}
          />
          <Text text="Solution." x={left} y={top} fontSize={30} />
          <Text
            text="X"
            x={right - 20}
            y={top}
            fontSize={20}
            fontStyle="bold"
            fill={App.highlightColor}
            onClick={() => {
              setStepsVisible(false);
            }}
          />
          <Group x={left} y={stepByStepTop}>
            {solveSteps.map((step, index) => {
              stepHeight = lineOffset + stepInfoYOffset + allSubStepsHeight;
              allSubStepsHeight = 0;
              return (
                <Group y={stepHeight * index} key={index}>
                  <Text
                    text={step.changeType}
                    fontSize={stepFontSize}
                    fill={App.highlightColor}
                  />
                  <Line
                    points={[0, 0, right - left, 0]}
                    stroke="#777"
                    strokeWidth={0.5}
                    y={lineOffset}
                  ></Line>
                  {/* Step Info 

                  <Group x={stepInfoXOffset}>
                    {step.substeps.length > 0
                      ? step.substeps.map((substep, subStepIndex) => {
                          allSubStepsHeight += subStepHeight;
                          return (
                            <Group
                              y={subStepHeight * subStepIndex}
                              key={(index + 1) * subStepIndex * 1000}
                            >
                              <Text
                                y={subStepChangeTypeOffset}
                                text={substep.changeType}
                                fontSize={stepFontSize}
                                fill={App.highlightColor}
                              />
                              <Text
                                y={substepAfterChangeOffset}
                                text={substep.newEquation.ascii()}
                                fontSize={stepFontSize}
                                fill="black"
                              ></Text>
                            </Group>
                          );
                        })
                      : null}
                  </Group>
                  */}
                  <Text
                    y={stepInfoXOffset + step_by_step_margins}
                    text={step.afterChange}
                    fontSize={stepFontSize}
                    fill="black"
                  ></Text>
                </Group>
              );
            })}
          </Group>

          {/* Loop through the steps */}
        </>
      ) : null}
    </Group>
  );
}

export default Steps;
