import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { getValidations } from '@app/utils/validations';

/*
 * This converts our `validation` object into redux-form compatible `validate` prop.
 * Using `constructor()` is a requirement as redux-form will re-register a field component
 * if validate appears to change, and since we use function generators, identities will not match
 * if we fetch this directly in the render method.
 */
const withValidation = (WrappedComponent) => {
  class Validated extends Component {
    constructor(props) {
      super(props);
      const { validation } = this.props;
      this.state = { validate: getValidations(validation || []) };
    }

    componentDidUpdate(prevProps) {
      const { validation } = this.props;
      if (!isEqual(prevProps.validation, validation)) {
        // eslint-disable-next-line
        this.setState({
          validate: getValidations(validation || []),
        });
      }
    }

    render() {
      const { validate } = this.state;
      return (
        <WrappedComponent
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...this.props}
          validate={validate}
        />
      );
    }
  }

  Validated.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    validation: PropTypes.object.isRequired,
  };

  return Validated;
};

export default withValidation;
