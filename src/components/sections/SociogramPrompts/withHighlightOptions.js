import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { getHighlightVariablesForSubject } from './selectors';

const withHighlightOptions = (state, props) => {
  const allowHighlighting = formValueSelector(props.form)(state, 'highlight.allowHighlighting');
  const highlightVariable = formValueSelector(props.form)(state, 'highlight.variable');
  const highlightVariablesForSubject = getHighlightVariablesForSubject(state, props);

  return {
    highlightVariablesForSubject,
    allowHighlighting,
    highlightVariable,
  };
};

export default connect(withHighlightOptions);
