import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import CodeView from './CodeView';

const mapStateToProps = (state, { form }) => ({
  code: getFormValues(form)(state),
});

export default connect(mapStateToProps)(CodeView);
