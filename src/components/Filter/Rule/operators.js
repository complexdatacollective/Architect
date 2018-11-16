import { toPairs, get } from 'lodash';

const operators = toPairs({
  EXACTLY: 'is Exactly',
  EXISTS: 'Exists',
  NOT_EXISTS: 'Not Exists',
  NOT: 'is Not',
  GREATER_THAN: 'is Greater Than',
  GREATER_THAN_OR_EQUAL: 'is Greater Than or Exactly',
  LESS_THAN: 'is Less Than',
  LESS_THAN_OR_EQUAL: 'is Less Than or Exactly',
});

const operatorsByType = {
  text: ['EXACTLY', 'EXISTS', 'NOT_EXISTS', 'NOT'],
  number: ['EXACTLY', 'EXISTS', 'NOT_EXISTS', 'NOT', 'GREATER_THAN', 'GREATER_THAN_OR_EQUAL', 'LESS_THAN', 'LESS_THAN_OR_EQUAL'],
  boolean: ['EXACTLY', 'EXISTS', 'NOT_EXISTS'],
};

const getOperatorsForType = (type) => {
  const operatorsForType = get(operatorsByType, type, operatorsByType.text);

  return operators.filter(([value]) => operatorsForType.includes(value));
};

export {
  operators,
  getOperatorsForType,
};
