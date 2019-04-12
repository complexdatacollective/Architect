import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { getEdgesForSubject } from './selectors';

const withEdgesOptions = (state, props) => {
  const allowHighlighting = formValueSelector(props.form)(state, 'highlight.allowHighlighting');
  const edgesForSubject = getEdgesForSubject(state, props);

  return {
    edgesForSubject,
    allowHighlighting,
  };
};

export { withEdgesOptions };

export default connect(withEdgesOptions);
