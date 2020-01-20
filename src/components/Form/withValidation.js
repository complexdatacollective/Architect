import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { getValidations } from '@app/utils/validations';

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

      this.state = { validate: getValidations(props.validation || []) };
    }

    componentDidUpdate(prevProps) {
      if (!isEqual(prevProps.validation, this.props.validation)) {
        // eslint-disable-next-line
        this.setState({
          validate: getValidations(this.props.validation || []),
        });
      }
    }

    render() {
      return <WrappedComponent {...this.props} validate={this.state.validate} />;
    }
  };

export default withValidation;
