'use strict';

const expect = require('expect');

const Calculator = require('../Calculator');


describe('Calculator', () => {
  describe('parse', () => {
    it('should work with single-digit numbers', () => {
      const expected = {
        tokens: ['(', '1', '+', '2', ')', '*', '4', '+', '3']
      };
      const actual = Calculator.parse('(1 + 2) * 4 + 3');

      expect(actual).toEqual(expected);
    });

    it('should work with multi-digit numbers', () => {
      const expected = {
        tokens: ['(', '1', '+', '22', ')', '*', '444', '+', '3333']
      };
      const actual = Calculator.parse('(1 + 22) * 444 + 3333');

      expect(actual).toEqual(expected);
    });

    it('should support crazy spacing', () => {
      const expected = {
        tokens: ['(', '1', '+', '2', ')', '*', '3'],
      };
      const actual = Calculator.parse('(  1+    2)  *3');

      expect(actual).toEqual(expected);
    });

    it('should error for string with wrong symbols', () => {
      const expected = { error: 'Invalid expression' };
      const actual = Calculator.parse('1 a 2 # 3 - 4 / 2');

      expect(actual).toEqual(expected);
    });
  });

  describe('infixToPostfix', () => {
    it('should work without parens', () => {
      const expected = {
        rpn: ['7', '2', '3', '*', '-'],
      };
      const actual = Calculator.infixToPostfix('7 - 2 * 3'.split(' '));

      expect(actual).toEqual(expected);
    });

    it('should work with parens', () => {
      const expected = {
        rpn: ['1', '2', '+', '4', '*', '3', '+'],
      };
      const actual = Calculator.infixToPostfix('( 1 + 2 ) * 4 + 3'.split(' '));

      expect(actual).toEqual(expected);
    });

    it('should error on incorrect parens 1', () => {
      const expected = {
        error: 'Incorrect parens',
      };
      const actual = Calculator.infixToPostfix('1 + 2 ) * 4 + 3'.split(' '));

      expect(actual).toEqual(expected);
    });

    it('should error on incorrect parens 2', () => {
      const expected = {
        error: 'Incorrect parens',
      };
      const actual = Calculator.infixToPostfix('( 1 + 2 * 4 + 3'.split(' '));

      expect(actual).toEqual(expected);
    });
  });

  describe('execute', () => {
    it('should error on 0 division', () => {
      const expected = { error: 'Zero division' };
      const actual = Calculator.execute(['1', '0', '/']);

      expect(actual).toEqual(expected);
    });

    it('should error on invalid expressions 1', () => {
      const expected = { error: 'Invalid expression' };
      const actual = Calculator.execute(['1', '+']);

      expect(actual).toEqual(expected);
    });

    it('should error on invalid expressions 2', () => {
      const expected = { error: 'Invalid expression' };
      const actual = Calculator.execute(['1', '2', '3', '+']);

      expect(actual).toEqual(expected);
    });
  });

  describe('evaluate', () => {
    it('should just work', () => {
      const expected = { result: 10 };
      const actual = Calculator.evaluate('(2 + 2) * 3 / 2 + 4');

      expect(actual).toEqual(expected);
    });

    it('should work for single-number expression', () => {
      const expected = { result: 42 };
      const actual = Calculator.evaluate('42');

      expect(actual).toEqual(expected);
    });

    it('should use correct operator precedence', () => {
      const expected = { result: 7 };
      const actual = Calculator.evaluate('1 + 2 * 3');

      expect(actual).toEqual(expected);
    });

    it('should behave correct with parens', () => {
      const expected = { result: 9 };
      const actual = Calculator.evaluate('(1 + 2) * 3');

      expect(actual).toEqual(expected);
    });

    it('should work with multiple digits numbers', () => {
      const expected = { result: 610 };
      const actual = Calculator.evaluate('10 + 20 * 30');

      expect(actual).toEqual(expected);
    });
  });
});
