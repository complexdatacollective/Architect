import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { getValidations } from '../../utils/validations';

/*
 * This converts our `validation` object into redux-form compatible `validate` prop.
 * Using `constructor()` is a requirement as redux-form will re-register a field component
 * if validate appears to change, and since we use function generators, identites will not match
 * if we fetch this directly in the render method.
 */
const withValidation = WrappedComponent =>
  class Validated extends Component {
    static propTypes = {
      validation: PropTypes.object.isRequired,
    };

    constructor(props) {
      super(props);

      this.validate = getValidations(props.validation || []);
    }

    render() {
      return <WrappedComponent {...this.props} validate={this.validate} />;
    }
  };

export default withValidation(Field);
