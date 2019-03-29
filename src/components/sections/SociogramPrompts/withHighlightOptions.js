import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { getHighlightVariablesForNodeType } from './selectors';

const withHighlightOptions = (state, props) => {
  const allowHighlighting = formValueSelector(props.form)(state, 'highlight.allowHighlighting');
  const highlightVariablesForNodeType = getHighlightVariablesForNodeType(state, props);
  // TODO: calculate this:
  const unusedHighlightVariablesForNodeType = getHighlightVariablesForNodeType(state, props);

  return {
    unusedHighlightVariablesForNodeType,
    highlightVariablesForNodeType,
    allowHighlighting,
  };
};

export { withHighlightOptions };

export default connect(withHighlightOptions);
