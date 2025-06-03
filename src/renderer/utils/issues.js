import {
  compact,
  flatMap,
  isPlainObject,
} from 'lodash';
import scrollTo from './scrollTo';

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
const flattenIssues = (issues, path = '') => compact(
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

      if (issue === undefined) {
        return null;
      }

      // we've found the issue node!
      return { issue, field: `${path}${field}` };
    },
  ),
);

const getFieldId = (field) => {
  // Needs to be safe for urls and ids
  const safeFieldName = encodeURIComponent(field.replace(/\[|\]|\./g, '_'));
  return `field_${safeFieldName}`;
};

const getTopOffsetById = (fieldId) => {
  const target = document.getElementById(fieldId);

  if (!target) { return null; }

  const { top } = target.getBoundingClientRect();

  return top;
};

const asOffsetIdPair = ({ field }) => {
  const fieldId = getFieldId(field);
  const top = getTopOffsetById(fieldId);
  return [top, fieldId];
};

const scrollToFirstIssue = (issues, container = document) => {
  const issueOffsets = flattenIssues(issues)
    .map(asOffsetIdPair);

  const [, firstIssueField] = issueOffsets
    .reduce((memo, issue) => {
      if (issue[0] === null) return memo;
      if (issue[0] > memo[0]) return memo;
      return issue;
    }, []);

  if (!firstIssueField) { return; }
  const target = container.querySelector(`#${firstIssueField}`);

  if (!target) { return; }

  scrollTo(target);
};

export {
  getFieldId,
  flattenIssues,
  scrollToFirstIssue,
};
