import { isPlainObject, flatMap, toPairs, isArray } from 'lodash';

const flatten = (value, path, memo = []) => {
  if (isArray(value)) return flatMap(value, (v, i) => flatten(v, (path ? `${path}[${i}]` : `[${i}]`), memo));
  if (!isPlainObject(value)) return [[path, value]];
  return memo.concat(
    flatMap(
      toPairs(value),
      ([k, v]) =>
        flatten(v, (path ? `${path}.${k}` : k), memo),
    ),
  );
};

export default flatten;
