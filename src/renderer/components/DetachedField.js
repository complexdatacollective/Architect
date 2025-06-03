import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { compose, defaultProps } from 'recompose';
import { getValidations } from '@app/utils/validations';
import IssueAnchor from './IssueAnchor';

const getValue = (eventOrValue) => {
  if (!eventOrValue || !eventOrValue.target) {
    return eventOrValue;
  }

  const { target } = eventOrValue;
  const value = target.type === 'checkbox' ? target.checked : target.value;

  return value;
};

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

class DetachedField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      valid: null,
      invalid: null,
      touched: false,
    };
  }

  handleChange = (eventOrValue) => {
    const {
      onChange,
      name,
      value,
    } = this.props;

    const nextValue = getValue(eventOrValue);
    this.setState({ touched: true });
    this.validate(nextValue);
    onChange(eventOrValue, nextValue, value, name);
  }

  validate(value) {
    const { validation } = this.props;

    const validate = getValidations(validation);

    const errors = validate.reduce(
      (memo, rule) => {
        const result = rule(value);
        if (!result) { return memo; }
        return [...memo, result];
      },
      [],
    );

    const isValid = errors.length === 0;

    const meta = {
      error: errors.join(),
      valid: isValid,
      invalid: !isValid,
    };

    if (!isEqual(meta, this.state)) {
      this.setState(meta);
    }
  }

  render() {
    const {
      component: FieldComponent,
      onChange,
      validation,
      value,
      name,
      meta,
      issueDescription,
      label,
      ...props
    } = this.props;

    const input = {
      value,
      name,
      onChange: this.handleChange,
    };

    return (
      <IssueAnchor
        fieldName={name}
        description={issueDescription || `Field: ${label}` || `Field: ${name}`}
      >
        <FieldComponent
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
          input={input}
          meta={{
            ...meta,
            ...this.state,
          }}
        />
      </IssueAnchor>
    );
  }
}

DetachedField.propTypes = {
  issueDescription: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.any,
  name: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  validation: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  component: PropTypes.any.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  meta: PropTypes.object,
};

DetachedField.defaultProps = {
  issueDescription: null,
  label: null,
  meta: {},
  value: null,
};

export default compose(
  defaultProps({ validation: {} }),
)(DetachedField);
