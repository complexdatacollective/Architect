import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { getHighlightVariablesForSubject } from './selectors';

const withHighlightOptions = (state, props) => {
  const allowHighlighting = formValueSelector(props.form)(state, 'highlight.allowHighlighting');
  const highlightVariablesForSubject = getHighlightVariablesForSubject(state, props);

  return {
    highlightVariablesForSubject,
    allowHighlighting,
  };
};

export default connect(withHighlightOptions);
