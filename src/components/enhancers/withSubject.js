import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

const mapStateToProps = (state, { form }) => {
  const subject = formValueSelector(form)(state, 'subject');

  return {
    ...subject,
  };
};

export default connect(mapStateToProps);
