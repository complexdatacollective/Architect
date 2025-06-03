import { get, reduce, isArray } from 'lodash';

/**
 * Collect _values_ that match path from `obj`. We are using this
 * to collect variableIds from the protocol object, but it could
 * be used to collect any value from a list of paths.
 *
 * Example usage:
 *
 * ```
 * const myObject = {
 *   stages: [
 *     {
 *       prompts: [
 *         { variable: 'foo' },
 *         { variable: 'bar' },
 *       ]
 *     },
 *     {
 *       prompts: [
 *         { variable: 'bazz' },
 *       ]
 *     },
 *   ]
 * };
 *
 * const paths = collectPaths('stages[].prompts[].variable', myObject);
 * // result:
 * // paths = {
 * //   'stages[0].prompts[0].variable': 'foo',
 * //   'stages[0].prompts[1].variable': 'bar',
 * //   'stages[1].prompts[0].variable': 'bazz',
 * // };
 * ```
 *
 * @returns {object} in format: { [path]: value }
 */
const collectPath = (objPath, obj, memoPath) => {
  // We expect a string notation for objPath, but it's actually converted to array automatically:
  // 'stages[].prompts[].subject.type' => ['stages', 'prompts', 'subject.type']
  const parsedPath = isArray(objPath)
    ? objPath
    : objPath.split('[].');
  const [, ...rest] = parsedPath;
  let [next] = parsedPath;
  let scanArray = false;

  // if end is array then we wanted to parse it as one
  if (next.slice(-2) === '[]') {
    next = next.slice(0, -2);
    scanArray = true;
  }

  const path = memoPath
    ? `${memoPath}.${next}` : `${next}`;

  const nextObj = get(obj, next);

  if (rest.length > 0) {
    return reduce(
      nextObj || [],
      (memo, item, index) => ({
        ...memo,
        ...collectPath(rest, item, `${path}[${index}]`),
      }),
      {},
    );
  }

  // special case to parse end array
  if (Array.isArray(nextObj) && scanArray) {
    const result = reduce(
      nextObj || [],
      (memo, item, index) => ({
        ...memo,
        [`${path}[${index}]`]: item,
      }),
      {},
    );

    return result;
  }

  if (nextObj) {
    return {
      [path]: nextObj,
    };
  }

  return {};
};

/**
 *  This applies a function to the value of each mapped function,
 * for the case where we need to apply additional logic to the
 * _value_ at the path.
 *
 * For example:
 * ```
 * const obj = {
 *   foos: [
 *     { bar: { entity: 'node', type: 'NODE_UUID_1' } },
 *     { bar: { entity: 'edge', type: 'NODE_UUID_2' } },
 *   ],
 * };
 *
 * const filterFunction = ({ entity, type }) => {
 *   // skip values which aren't nodes
 *   if (entity !== 'node) { return undefined; }
 *
 *   // just return the uuid, and not the whole value
 *   return type;
 * };
 *
 * const r = collectMappedPaths(['foos[].bar', obj, filterFunction);
 *
 * // r = {
 * //   'foos[0].bar.type', 'NODE_UUID_1',
 * // };
 * ```
 */
export const collectMappedPath = (paths, obj, mapFunc) => {
  const collectedPaths = collectPath(paths, obj);

  return reduce(collectedPaths, (acc, value, path) => {
    const result = mapFunc(value, path);

    if (result === undefined) { return acc; }
    return {
      ...acc,
      [result[1]]: result[0],
    };
  }, {});
};

export const collectPaths = (objPaths, object) => objPaths.reduce((acc, objPath) => {
  const next = Array.isArray(objPath)
    ? collectMappedPath(objPath[0], object, objPath[1])
    : collectPath(objPath, object);

  return {
    ...acc,
    ...next,
  };
}, {});

export default collectPath;
