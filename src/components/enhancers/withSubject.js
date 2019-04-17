import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

const defaultSubject = { entity: 'ego', type: null };

const mapStateToProps = (state, { form }) => {
  const subject = formValueSelector(form)(state, 'subject') || defaultSubject;

  return {
    ...subject,
  };
};

export default connect(mapStateToProps);
