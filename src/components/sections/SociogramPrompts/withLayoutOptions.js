import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { getLayoutVariablesForSubject } from './selectors';
import { getVariablesForSubject } from '../../../selectors/codebook';

const withLayoutOptions = (state, { entity, type, form }) => {
  const variablesForSubject = getVariablesForSubject(state, { entity, type });
  const layoutVariablesForSubject = getLayoutVariablesForSubject(state, { entity, type });
  const allowPositioning = formValueSelector(form)(state, 'layout.allowPositioning');
  const layoutVariable = formValueSelector(form)(state, 'layout.layoutVariable');

  return {
    variablesForSubject,
    layoutVariablesForSubject,
    allowPositioning,
    layoutVariable,
  };
};

export default connect(withLayoutOptions);
