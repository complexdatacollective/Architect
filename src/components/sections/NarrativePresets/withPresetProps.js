import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { change } from 'redux-form';
import { actionCreators as codebookActions } from '@modules/protocol/codebook';
import {
  getNarrativeVariables,
  getEdgesForSubject,
} from './selectors';

const mapStateToProps = (state, { entity, type }) => {
  const narrativeVariables = getNarrativeVariables(state, { entity, type });
  const edgesForSubject = getEdgesForSubject(state, { entity, type });

  return {
    ...narrativeVariables,
    edgesForSubject,
  };
};

const mapDispatchToProps = {
  createVariable: codebookActions.createVariable,
  deleteVariable: codebookActions.deleteVariable,
  changeForm: change,
};

const variableHandlers = withHandlers({
  handleCreateLayoutVariable: ({
    form,
    changeForm,
    createVariable,
    entity,
    type,
  }) => async (name) => {
    const { variable } = await createVariable(entity, type, { type: 'layout', name });
    changeForm(form, 'layoutVariable', variable);
    return variable;
  },
  handleDeleteVariable: (
    { entity, type, deleteVariable },
  ) => (variable) => deleteVariable(entity, type, variable),
});

const withPresetProps = compose(
  connect(mapStateToProps, mapDispatchToProps),
  variableHandlers,
);

export default withPresetProps;
