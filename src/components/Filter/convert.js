/* eslint-disable import/prefer-default-export */

import { get } from 'lodash';

const formatValue = (type, value) => {
  switch (type) {
    case 'number':
      return parseInt(value, 10);
    case 'boolean':
      return !!value;
    default:
      return value;
  }
};

const parse = (filter, { types }) => {
  const rules = filter.rules.map(
    (rule) => {
      const { type: ruleType, options } = rule;

      if (!options) return rule;

      const entityType = ruleType === 'edge' ? 'edge' : 'node';
      const attributeType = get(types, [entityType, options.type, options.attribute]);

      if (!attributeType || !options.value) return rule;

      return {
        ...rule,
        options: {
          ...rule.options,
          value: formatValue(attributeType, options.value),
        },
      };
    },
  );

  return {
    ...filter,
    rules,
  };
};

export {
  parse,
};
