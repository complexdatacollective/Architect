import { lifecycle } from 'recompose';
import { Field } from 'redux-form';
import { getValidations } from '../../utils/validations';

/*
 * This converts our `validation` object into redux-form compatible `validate` methods.
 * Using `componentWillMount()` is a requirement as redux-form will re-register a field component
 * if validate appears to change, and since we use function generators, identites will not match.
 */
const ValidatedField = lifecycle({
  componentWillMount() {
    this.setState({ validate: getValidations(this.props.validation || []) });
  }
})(Field);

export default ValidatedField;
