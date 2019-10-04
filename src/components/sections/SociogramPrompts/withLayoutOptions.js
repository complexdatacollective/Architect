import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { getVariables } from '@selectors/codebook';
import { getLayoutVariablesForSubject } from './selectors';

const withLayoutOptions = (state, { entity, type, form }) => {
  const subject = { entity, type };
  const variablesForSubject = getVariables(state, { subject }); // TODO: asOption?
  const layoutVariablesForSubject = getLayoutVariablesForSubject(state, { entity, type });
  const allowPositioning = formValueSelector(form)(state, 'layout.allowPositioning');

  return {
    variablesForSubject,
    layoutVariablesForSubject,
    allowPositioning,
  };
};

export { withLayoutOptions };

export default connect(withLayoutOptions);
