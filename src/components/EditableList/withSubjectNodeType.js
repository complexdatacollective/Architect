import { connect } from 'react-redux';
import { get } from 'lodash';
import { formValueSelector } from 'redux-form';

const mapStateToProps = (state, { form }) => {
  const nodeType = get(formValueSelector(form)(state, 'subject'), 'type');

  return {
    nodeType,
  };
};

export default connect(mapStateToProps);
