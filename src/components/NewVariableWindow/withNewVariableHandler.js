import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { compose, withHandlers } from 'recompose';
import { actionCreators as codebookActions } from '../../ducks/modules/protocol/codebook';

export const form = 'create-new-variable';

const mapStateToProps = (state) => {
  const variableType = formValueSelector(form)(state, 'type');

  return {
    variableType,
  };
};

const mapDispatchToProps = { createVariable: codebookActions.createVariable };

const newVariableHandlers = withHandlers({
  handleCreateNewVariable: ({
    entity,
    type,
    createVariable,
    onComplete,
  }) =>
    (configuration) => {
      const { variable } = createVariable(entity, type, configuration);
      onComplete(variable);
    },
});

const withNewVariableHandler = compose(
  connect(mapStateToProps, mapDispatchToProps),
  newVariableHandlers,
);

export default withNewVariableHandler;
