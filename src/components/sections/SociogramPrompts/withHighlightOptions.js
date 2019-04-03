import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { getHighlightVariablesForNodeType } from './selectors';

const withHighlightOptions = (state, props) => {
  const allowHighlighting = formValueSelector(props.form)(state, 'highlight.allowHighlighting');
  const unusedHighlightVariablesForNodeType = getHighlightVariablesForNodeType(state, props);

  return {
    unusedHighlightVariablesForNodeType,
    allowHighlighting,
  };
};

export { withHighlightOptions };

export default connect(withHighlightOptions);
