import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { change, formValueSelector } from 'redux-form';

const mapStateToProps = (state, { form }) => {
  const type = formValueSelector(form)(state, 'type');

  return {
    type,
  };
};

const mapDispatchToProps = {
  changeForm: change,
};

const itemState = connect(mapStateToProps, mapDispatchToProps);

const itemHandlers = withHandlers({
  handleChangeType:
    ({ changeForm, form }) =>
    () => {
      changeForm(form, 'content', null);
    },
});

const withItemHandlers = compose(itemState, itemHandlers);

export default withItemHandlers;
