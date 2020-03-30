import React, { useReducer, useCallback } from 'react';
import { createReducer, createAction } from 'redux-toolkit';
import { compose, defaultProps } from 'recompose';
import withValidation from '@components/Form/withValidation';

const getValue = (eventOrValue) => {
  if (!eventOrValue || !eventOrValue.target) {
    return eventOrValue;
  }

  const target = eventOrValue.target;
  const value = target.type === 'checkbox' ? target.checked : target.value;

  return value;
};

const getErrors = (validators, value) =>
  validators.reduce(
    (memo, rule) => {
      const result = rule(value);
      if (!result) { return memo; }
      return [...memo, result];
    },
    [],
  );

const initialState = {
  error: '',
  valid: null,
  invalid: null,
  touched: false,
};

const validationErrors = createAction(
  'VALIDATION_ERRORS',
  errors => ({
    error: errors.join(' '),
    valid: errors.length === 0,
    invalid: errors.length !== 0,
  }),
);

const reducer = createReducer({
  [validationErrors]: (state, { payload }) => ({
    ...state,
    error: payload.error,
    valid: payload.valid,
    invalid: payload.invalid,
    touched: true,
  }),
});

/*
 * Interface mirroring that of Redux Form Field,
 * for compatablity with our input components, without the
 * pesky redux integration (relies on `onChange` and `value`).
 * Currently only the minimum required interface has been
 * implemented for our use-case.
 *
 * Redux Form Field API documentation:
 * https://redux-form.com/7.4.2/docs/api/field.md/
 */
const Field = ({
  component: FieldComponent,
  onChange,
  onValidate,
  validate: validators,
  value,
  name,
  meta,
  parse,
  format,
  ...props
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = useCallback((eventOrValue) => {
    const newValue = getValue(eventOrValue);
    const errors = getErrors(validators, newValue);
    dispatch(validationErrors(errors));

    onValidate(name, errors.length !== 0 ? errors : null);
    // TODO: Do we need this interface for compatibility?
    // onChange(eventOrValue, value, newValue, name);
    onChange(name, parse(newValue));
  });

  const inputProp = {
    value: format(value),
    name,
    onChange: handleChange,
  };

  const metaProp = {
    ...meta,
    ...state,
  };

  return (
    <FieldComponent
      input={inputProp}
      meta={metaProp}
      {...props}
    />
  );
};

export { Field };

export default compose(
  defaultProps({
    validation: {},
    onChange: () => {},
    onValidate: () => {},
    parse: x => x,
    format: x => x,
  }),
  withValidation,
)(Field);
