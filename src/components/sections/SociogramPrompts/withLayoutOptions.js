import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { getLayoutVariablesForSubject } from './selectors';
import { getVariablesForSubject } from '../../../selectors/codebook';

const withLayoutOptions = (state, props) => {
  const variablesForSubject = getVariablesForSubject(state, props.nodeType);
  const layoutVariablesForSubject = getLayoutVariablesForSubject(state, props);
  const allowPositioning = formValueSelector(props.form)(state, 'layout.allowPositioning');

  return {
    variablesForSubject,
    layoutVariablesForSubject,
    allowPositioning,
  };
};

export { withLayoutOptions };

export default connect(withLayoutOptions);
