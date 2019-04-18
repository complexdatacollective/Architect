import { arrayPush } from 'redux-form';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';

const newVariableHandlers = withHandlers({
  handleCreateNewSearchVariable: ({ pushField, form, closeNewVariableWindow }) =>
    (variable) => {
      pushField(form, 'searchOptions.matchProperties', variable);
      closeNewVariableWindow();
    },
});

const mapDispatchToProps = {
  pushField: arrayPush,
};

const withNewVariableHandlers = compose(
  connect(null, mapDispatchToProps),
  newVariableHandlers,
);

export default withNewVariableHandlers;
