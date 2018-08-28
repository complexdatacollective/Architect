import { flatMap, isPlainObject } from 'lodash';

/**
 * Converts a nested object into a flattened version with paths.
 *
 * const issues = {
 *   foo: 'bar',
 *   baz: [
 *     {
 *       buzz: 'foo',
 *       deeper: [
 *         { fizz: 'pop' },
 *         { buzz: 'pow' },
 *       ],
 *       beep: {
 *         boop: 'bop',
 *       },
 *    },
 *  ],
};
 *
 * flattenIssues(issues);
 * // Output:
 * // [
 * //   { issue: 'bar', field: 'foo' },
 * //   { issue: 'foo', field: 'baz[0].buzz' },
 * //   { issue: 'pop', field: 'baz[0].deeper[0].fizz' },
 * //   { issue: 'pow', field: 'baz[0].deeper[1].buzz' },
 * //   { issue: 'bop', field: 'baz[0].beep.boop' },
 * // ]"
 */
export const flattenIssues = (issues, path = '') =>
  flatMap(
    issues,
    (issue, field) => {
      // field array
      if (Array.isArray(issue)) {
        return flatMap(issue, (item, index) => flattenIssues(item, `${path}${field}[${index}].`));
      }
      // nested field
      if (isPlainObject(issue)) {
        return flattenIssues(issue, `${path}${field}.`);
      }
      // we've found the issue node!
      return { issue, field: `${path}${field}` };
    },
  );

export const getFieldId = (field) => {
  // Needs to be safe for urls and ids
  const safeFieldName = encodeURIComponent(field.replace(/\[|\]|\./g, '_'));
  return `field-${safeFieldName}`;
};
