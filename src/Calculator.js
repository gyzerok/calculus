'use strict';

const PLUS = '+';
const MINUS = '-';
const MULTIPLY = '*';
const DIVIDE = '/';
const LPAREN = '(';
const RPAREN = ')';

const precedence = {
  [MULTIPLY]: 30,
  [DIVIDE]: 30,
  [PLUS]: 20,
  [MINUS]: 20,
  [LPAREN]: 10,
  [RPAREN]: 10,
};

const alphabet = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
  PLUS, MINUS, MULTIPLY, DIVIDE, LPAREN, RPAREN,
  ' ',
];

module.exports = {
  evaluate: evaluate,
  parse: parse,
  infixToPosfix: infixToPosfix,
  execute: execute,
};

function evaluate(str) {
  const parsed = parse(str);
  if (parsed.error) {
    return parsed;
  }

  const postfix = infixToPosfix(parsed.tokens);
  if (postfix.error) {
    return postfix;
  }

  return execute(postfix.rpn);
}

function parse(str) {
  const splittedStr = str.split('');
  const isValidExpression = splittedStr
    .every(char => alphabet.indexOf(char) !== -1);

  if (!isValidExpression) {
    return {
      error: 'Invalid expression',
    };
  }

  const result = splittedStr
    .reduce((acc, char) => {
      const isDigit = /\d/.test(char);
      if (!isDigit) {
        return {
          numberAccumulator: '',
          tokens: acc.tokens
            .concat(acc.numberAccumulator)
            .concat(char),
        };
      }

      return {
        numberAccumulator: acc.numberAccumulator + char,
        tokens: acc.tokens,
      };
    }, { numberAccumulator: '', tokens: [] });

  return {
    tokens: result.tokens
      .concat(result.numberAccumulator)
      .filter(x => x !== '' && x !== ' ')
  };
}

function infixToPosfix(tokens) {
  const rpn = [];
  const operatorStack = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    const isNumber = /\d/.test(token);
    if (isNumber) {
      rpn.push(token);
      continue;
    }

    if (token === LPAREN) {
      operatorStack.unshift(token);
      continue;
    }

    if (token === RPAREN) {
      while (operatorStack.length && operatorStack[0] !== LPAREN) {
        rpn.push(operatorStack.shift());
      }
      const parensAreInvalid = operatorStack.length === 0;
      if (parensAreInvalid) {
        return {
          error: 'Incorrect parens',
        };
      }
      operatorStack.shift();
      continue;
    }

    while (operatorStack.length && precedence[token] <= precedence[operatorStack[0]]) {
      rpn.push(operatorStack.shift());
    }
    operatorStack.unshift(token);
  }

  const parensAreInvalid = operatorStack.indexOf(LPAREN) !== -1;
  if (parensAreInvalid) {
    return {
      error: 'Incorrect parens',
    };
  }

  return { rpn: rpn.concat(operatorStack) };
}

function execute(postfix) {
  const stackOfTemporalComputations = [];

  while (postfix.length) {
    const operatorOrNumber = postfix.shift();

    const isNumber = /\d/.test(operatorOrNumber);
    if (isNumber) {
      stackOfTemporalComputations.unshift(operatorOrNumber);
      continue;
    }

    if (stackOfTemporalComputations.length < 2) {
      return {
        error: 'Invalid expression',
      };
    }

    const y = +stackOfTemporalComputations.shift();
    const x = +stackOfTemporalComputations.shift();

    if (operatorOrNumber === PLUS) {
      stackOfTemporalComputations.unshift(x + y);
    }
    if (operatorOrNumber === MINUS) {
      stackOfTemporalComputations.unshift(x - y);
    }
    if (operatorOrNumber === MULTIPLY) {
      stackOfTemporalComputations.unshift(x * y);
    }
    if (operatorOrNumber === DIVIDE) {
      if (y === 0) {
        return {
          error: 'Zero division',
        };
      }

      stackOfTemporalComputations.unshift(x / y);
    }
  }

  if (stackOfTemporalComputations.length !== 1) {
    return {
      error: 'Invalid expression',
    };
  }

  return {
    result: stackOfTemporalComputations.shift(),
  };
}
