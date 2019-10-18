import { get, reduce, isArray } from 'lodash';

/**
 * Collect nodes that match path from `obj`
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
 * @returns {object} in format: { [path]: node }
 */
const collectPaths = (paths, obj, memoPath) => {
  // We expect a string notation for paths, but it's actually converted to array automatically:
  // 'stages[].prompts[].subject.type' => ['stages', 'prompts', 'subject.type']
  const parsedPath = isArray(paths) ?
    paths :
    paths.split('[].');
  const [, ...rest] = parsedPath;
  let [next] = parsedPath;
  let scanArray = false;

  // if end is array then we wanted to parse it as one
  if (next.slice(-2) === '[]') {
    next = next.slice(0, -2);
    scanArray = true;
  }

  const path = memoPath ?
    `${memoPath}.${next}` : `${next}`;

  const nextObj = get(obj, next);

  if (rest.length > 0) {
    return reduce(
      nextObj || [],
      (memo, item, index) => ({
        ...memo,
        ...collectPaths(rest, item, `${path}[${index}]`),
      }),
      {},
    );
  }

  // special case to parse end array
  if (Array.isArray(nextObj) && scanArray) {
    return reduce(
      nextObj || [],
      (memo, item, index) => ({
        ...memo,
        [`${path}[${index}]`]: item,
      }),
      {},
    );
  }

  if (nextObj) {
    return {
      [path]: nextObj,
    };
  }

  return {};
};

export default collectPaths;
