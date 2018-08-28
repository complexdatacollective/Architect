import { flatMap } from 'lodash';

export const flattenIssues = (issues, path = '') =>
  flatMap(
    issues,
    (issue, field) => {
      if (Array.isArray(issue)) {
        return flatMap(issue, (item, index) => flattenIssues(item, `${path}${field}[${index}].`));
      }
      return { issue, field: `${path}${field}` };
    },
  );

export const getFieldId = (field) => {
  // Needs to be safe for urls and ids
  const safeFieldName = encodeURIComponent(field.replace(/\[|\]|\./g, '_'));
  return `field-${safeFieldName}`;
};
