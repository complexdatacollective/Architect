import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { withHandlers, compose } from 'recompose';
import { clearFields } from 'redux-form';

const mapDispatchToProps = (dispatch, props) => ({
  clearField: (fieldName) => {
    dispatch(clearFields(props.form, false, false, fieldName));
  },
});

const formHandlers = withHandlers({
  clearFieldIfEmpty: ({ clearField }) => (event, name, value) => {
    if (isEmpty(value)) {
      clearField(name);
      event.preventDefault();
    }
  },
});

const withFormHandlers = compose(
  connect(null, mapDispatchToProps),
  formHandlers,
);

export default withFormHandlers;
