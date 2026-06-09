const { add, subtract, multiply, divide } = require('../calculator');

describe('calculator functions', () => {
  test('addition: 2 + 3 = 5', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('addition: multiple operands', () => {
    expect(add(1, 2, 3, 4)).toBe(10);
  });

  test('subtraction: 10 - 4 = 6', () => {
    expect(subtract(10, 4)).toBe(6);
  });

  test('subtraction: left-associative with many operands', () => {
    expect(subtract(20, 5, 3)).toBe(12); // 20 - 5 - 3 = 12
  });

  test('multiplication: 45 * 2 = 90', () => {
    expect(multiply(45, 2)).toBe(90);
  });

  test('multiplication: multiple operands', () => {
    expect(multiply(2, 3, 4)).toBe(24);
  });

  test('division: 20 / 5 = 4', () => {
    expect(divide(20, 5)).toBe(4);
  });

  test('division: left-associative with many operands', () => {
    expect(divide(100, 2, 5)).toBe(10); // 100 / 2 / 5 = 10
  });

  test('division by zero should throw', () => {
    expect(() => divide(10, 0)).toThrow(/Division by zero/);
  });

  test('no operands: add returns 0', () => {
    expect(add()).toBe(0);
  });

  test('no operands: subtract returns 0', () => {
    expect(subtract()).toBe(0);
  });

  test('no operands: multiply returns 0', () => {
    expect(multiply()).toBe(0);
  });

  test('no operands: divide returns NaN', () => {
    expect(Number.isNaN(divide())).toBe(true);
  });
});
