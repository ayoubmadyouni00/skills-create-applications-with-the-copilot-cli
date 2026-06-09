#!/usr/bin/env node
'use strict';

/**
 * Node.js CLI Calculator
 * Supported operations:
 *  - add       (addition)
 *  - subtract  (subtraction)
 *  - multiply  (multiplication)
 *  - divide    (division)
 *
 * Usage (CLI):
 *   node src/calculator.js add 2 3 4
 *   node src/calculator.js divide 10 2
 *
 * The module also exports functions for programmatic use:
 *   const { add, subtract, multiply, divide } = require('./src/calculator');
 */

function toNumber(value) {
  const n = Number(value);
  if (Number.isNaN(n)) throw new Error(`Invalid number: ${value}`);
  return n;
}

function add(...operands) {
  return operands.reduce((acc, v) => acc + v, 0);
}

function subtract(...operands) {
  if (operands.length === 0) return 0;
  return operands.reduce((acc, v) => acc - v);
}

function multiply(...operands) {
  if (operands.length === 0) return 0;
  return operands.reduce((acc, v) => acc * v, 1);
}

function divide(...operands) {
  if (operands.length === 0) return NaN;
  return operands.slice(1).reduce((acc, v) => {
    if (v === 0) {
      const err = new Error('Error: Division by zero');
      err.code = 'DIV_BY_ZERO';
      throw err;
    }
    return acc / v;
  }, operands[0]);
}

module.exports = { add, subtract, multiply, divide };

// CLI wrapper
if (require.main === module) {
  const [, , op, ...args] = process.argv;

  const usage = `Usage: node src/calculator.js <operation> <num1> <num2> [<num3> ...]\n
Supported operations: add, subtract, multiply, divide`;

  if (!op) {
    console.error('Error: operation is required.\n' + usage);
    process.exit(1);
  }

  const operands = args.map(toNumber);

  if (operands.length < 2) {
    console.error('Error: at least two numeric operands are required.\n' + usage);
    process.exit(1);
  }

  try {
    let result;
    switch (op.toLowerCase()) {
      case 'add':
      case '+':
        result = add(...operands);
        break;
      case 'subtract':
      case '-':
        result = subtract(...operands);
        break;
      case 'multiply':
      case 'x':
      case '*':
        result = multiply(...operands);
        break;
      case 'divide':
      case '/':
        result = divide(...operands);
        break;
      default:
        console.error(`Error: unknown operation '${op}'.\n` + usage);
        process.exit(1);
    }

    // Print result to stdout
    console.log(result);
    process.exit(0);
  } catch (err) {
    if (err && err.code === 'DIV_BY_ZERO') {
      console.error('Division by zero detected.');
      process.exit(1);
    }
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}
