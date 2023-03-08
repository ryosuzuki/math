import * as math from 'mathjs';

const equation = 'y - sqrt(x) = 0';

math.evaluate(equation, { y: 2 })
// const yValue = 2;
// const tree = math.parse(equation);

// const substitutedTree = tree.transform((node) => {
//   if (node.isSymbolNode && node.name === 'y') {
//     return math.parse(yValue.toString())
//   }
//   return node;
// });

// console.log(substitutedTree)
// const solutions = math.solve(substitutedTree, 'x');
// console.log(solutions)

// // Simplify the substituted mathjs tree object to solve for x
// const simplifiedTree = math.simplify(substitutedTree);
// const compiledFunction = simplifiedTree.compile();

// console.log(compiledFunction)

// // // Evaluate the compiled function to solve for x
// const xValue = compiledFunction.evaluate(0);
// // console.log(xValue); // Output: 4