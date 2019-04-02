import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import {
  getVariablesForNodeType,
  getLayoutVariablesForNodeType,
} from './selectors';

const withLayoutOptions = (state, props) => {
  const variablesForNodeType = getVariablesForNodeType(state, props);
  const layoutVariablesForNodeType = getLayoutVariablesForNodeType(state, props);
  const allowPositioning = formValueSelector(props.form)(state, 'layout.allowPositioning');

  return {
    variablesForNodeType,
    layoutVariablesForNodeType,
    allowPositioning,
  };
};

export { withLayoutOptions };

export default connect(withLayoutOptions);
