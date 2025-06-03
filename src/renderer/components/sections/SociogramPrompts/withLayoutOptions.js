import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { getLayoutVariablesForSubject } from './selectors';
import { getVariableOptionsForSubject } from '../../../selectors/codebook';

const withLayoutOptions = (state, { entity, type, form }) => {
  const variableOptions = getVariableOptionsForSubject(state, { entity, type });
  const layoutVariablesForSubject = getLayoutVariablesForSubject(state, { entity, type });
  const allowPositioning = formValueSelector(form)(state, 'layout.allowPositioning');
  const layoutVariable = formValueSelector(form)(state, 'layout.layoutVariable');

  return {
    variableOptions,
    layoutVariablesForSubject,
    allowPositioning,
    layoutVariable,
  };
};

export default connect(withLayoutOptions);
