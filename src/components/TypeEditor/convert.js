import { reduce, get, omit } from 'lodash';

const formatValidations = validation =>
  reduce(
    validation,
    (memo, value, key) => [...memo, { type: key, value }],
    [],
  );

// convert protocol format into redux-form compatible format
const format = configuration => ({
  ...configuration,
  variables: reduce(
    get(configuration, 'variables', {}),
    (memo, variable, key) =>
      [
        ...memo,
        {
          ...variable,
          id: key,
          validation: formatValidations(get(variable, 'validation', {})),
        },
      ],
    [],
  ),
});

const parseValidations = validation =>
  reduce(
    validation,
    (memo, { type, value }) =>
      ({ ...memo, [type]: value || true }),
    {},
  );

// convert redux-form format into protocol format
const parse = configuration => ({
  ...configuration,
  variables: reduce(
    configuration.variables,
    (memo, variable) => ({
      ...memo,
      [variable.id]: {
        ...omit(variable, ['id', 'options']),
        // Ideally we'd remove this at source, but reduxForm doesn't seem to let us?
        ...(get(variable, 'options') ? { options: get(variable, 'options') } : {}),
        validation: parseValidations(get(variable, 'validation', [])),
      },
    }),
    {},
  ),
});

export {
  format,
  parse,
};
