#!/usr/bin/env node
'use strict';

/**
 * Node.js CLI Calculator
 * Supported operations:
 *  - add         (addition)
 *  - subtract    (subtraction)
 *  - multiply    (multiplication)
 *  - divide      (division)
 *  - modulo      (remainder)
 *  - power       (exponentiation)
 *  - squareRoot  (square root)
 *
 * Usage (CLI):
 *   node src/calculator.js add 2 3 4
 *   node src/calculator.js divide 10 2
 *   node src/calculator.js modulo 10 3
 *   node src/calculator.js power 2 8
 *   node src/calculator.js sqrt 9
 *
 * The module also exports functions for programmatic use:
 *   const { add, subtract, multiply, divide, modulo, power, squareRoot } = require('./src/calculator');
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

function modulo(...operands) {
  if (operands.length === 0) return NaN;
  return operands.slice(1).reduce((acc, v) => {
    if (v === 0) {
      const err = new Error('Error: Modulo by zero');
      err.code = 'MODULO_BY_ZERO';
      throw err;
    }
    return acc % v;
  }, operands[0]);
}

function power(...operands) {
  if (operands.length === 0) return NaN;
  // left-associative: ((base ^ exp1) ^ exp2) ...
  return operands.slice(1).reduce((acc, v) => Math.pow(acc, v), operands[0]);
}

function squareRoot(n) {
  if (n == null) return NaN;
  if (n < 0) {
    const err = new Error('Error: square root of negative number');
    err.code = 'NEGATIVE_SQRT';
    throw err;
  }
  return Math.sqrt(n);
}

module.exports = { add, subtract, multiply, divide, modulo, power, squareRoot };

// CLI wrapper
if (require.main === module) {
  const [, , op, ...args] = process.argv;

  const usage = `Usage: node src/calculator.js <operation> <num1> <num2> [<num3> ...]\n\nSupported operations: add, subtract, multiply, divide, modulo, power, sqrt`;

  if (!op) {
    console.error('Error: operation is required.\n' + usage);
    process.exit(1);
  }

  // parse operands; for sqrt allow a single operand
  try {
    let operands = args.map(toNumber);

    // Determine minimum operands required per operation
    const opKey = op.toLowerCase();
    const needsAtLeastTwo = ['add', '+', 'subtract', '-', 'multiply', 'x', '*', 'divide', '/', 'modulo', 'mod', '%', 'power', 'pow'];
    const allowsOne = ['sqrt', 'sqr', 'squareRoot', 'squareroot'];

    if (allowsOne.includes(opKey)) {
      if (operands.length < 1) {
        console.error('Error: at least one numeric operand is required for sqrt.\n' + usage);
        process.exit(1);
      }
    } else if (needsAtLeastTwo.includes(opKey)) {
      if (operands.length < 2) {
        console.error('Error: at least two numeric operands are required.\n' + usage);
        process.exit(1);
      }
    } else {
      // unknown op: still check if operands >=1 to avoid parsing issues
      if (operands.length < 1) {
        console.error('Error: numeric operands are required.\n' + usage);
        process.exit(1);
      }
    }

    let result;
    switch (opKey) {
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
      case 'modulo':
      case 'mod':
      case '%':
        result = modulo(...operands);
        break;
      case 'power':
      case 'pow':
      case '^':
        result = power(...operands);
        break;
      case 'sqrt':
      case 'sqr':
      case 'squareroot':
        result = squareRoot(operands[0]);
        break;
      default:
        console.error(`Error: unknown operation '${op}'.\n` + usage);
        process.exit(1);
    }

    // Print result to stdout
    console.log(result);
    process.exit(0);
  } catch (err) {
    if (err && (err.code === 'DIV_BY_ZERO' || err.code === 'MODULO_BY_ZERO')) {
      console.error(err.message.replace('Error: ', ''));
      process.exit(1);
    }
    if (err && err.code === 'NEGATIVE_SQRT') {
      console.error('Square root of negative number is not supported.');
      process.exit(1);
    }
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}
