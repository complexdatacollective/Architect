import { get } from 'lodash';

const validateRules = (value) => {
  const rules = get(value, 'rules', []);
  const join = get(value, 'join');

  if (rules.length > 1 && !join) {
    return 'Query/Filters with more that one rule must select a type of "join"';
  }

  return undefined;
};

export default validateRules;
