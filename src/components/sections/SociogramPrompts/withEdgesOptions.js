import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { getEdgesForNodeType } from './selectors';

const withEdgesOptions = (state, props) => {
  const allowHighlighting = formValueSelector(props.form)(state, 'highlight.allowHighlighting');
  const edgesForNodeType = getEdgesForNodeType(state, props);

  return {
    edgesForNodeType,
    allowHighlighting,
  };
};

export { withEdgesOptions };

export default connect(withEdgesOptions);
