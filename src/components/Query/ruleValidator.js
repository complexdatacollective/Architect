import { get } from 'lodash';

const validateRules = (value) => {
  const rules = get(value, 'rules', []);
  const join = get(value, 'join');

  if (rules.length > 1 && !join) {
    return 'Select an option above.';
  }

  return undefined;
};

export default validateRules;
