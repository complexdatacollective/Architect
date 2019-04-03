import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { getLayoutVariablesForNodeType } from './selectors';
import { getVariablesForNodeType } from '../../../selectors/codebook';

const withLayoutOptions = (state, props) => {
  const variablesForNodeType = getVariablesForNodeType(state, props.nodeType);
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
