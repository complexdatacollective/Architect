import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

const mapStateToProps = (state, { form }) => {
  const dataSource = formValueSelector(form)(state, 'dataSource') || null;
  return {
    dataSource,
  };
};

export default connect(mapStateToProps);
