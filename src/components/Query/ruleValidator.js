import { get } from 'lodash';

const validateRules = (value) => {
  const rules = get(value, 'rules', []);
  const join = get(value, 'join');

  if (rules.length > 1 && !join) {
    return 'Please select a join type';
  }

  if (rules.length === 0) {
    return 'Please create at least one rule';
  }

  return undefined;
};

export default validateRules;
