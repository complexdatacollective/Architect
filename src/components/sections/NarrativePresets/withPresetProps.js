import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { change } from 'redux-form';
import {
  getLayoutVariablesForSubject,
  getHighlightVariablesForSubject,
  getGroupVariablesForSubject,
  getEdgesForSubject,
} from './selectors';
import { actionCreators as codebookActions } from '../../../ducks/modules/protocol/codebook';

const mapStateToProps = (state, { entity, type }) => {
  const layoutVariblesForSubject = getLayoutVariablesForSubject(state, { entity, type });
  const highlightVariablesForSubject = getHighlightVariablesForSubject(state, { entity, type });
  const groupVariablesForSubject = getGroupVariablesForSubject(state, { entity, type });
  const edgesForSubject = getEdgesForSubject(state, { entity, type });

  return {
    layoutVariblesForSubject,
    highlightVariablesForSubject,
    groupVariablesForSubject,
    edgesForSubject,
  };
};

const mapDispatchToProps = {
  createVariable: codebookActions.createVariable,
  deleteVariable: codebookActions.deleteVariable,
  changeForm: change,
};

const variableHandlers = withHandlers({
  handleCreateLayoutVariable: ({ createVariable, entity, type }) =>
    (name) => {
      const { variable } = createVariable(entity, type, { type: 'layout', name });
      return variable;
    },
  handleCreateGroupVariable: ({ changeForm, form, closeNewVariableWindow }) =>
    (variable) => {
      changeForm(form, 'groupVariable', variable);
      closeNewVariableWindow();
    },
});

const withPresetProps = compose(
  connect(mapStateToProps, mapDispatchToProps),
  variableHandlers,
);

export default withPresetProps;
