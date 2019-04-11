
import { compose, withState, withHandlers, withProps } from 'recompose';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import { actionCreators as codebookActions } from '../../ducks/modules/protocol/codebook';

const createNewVariableState = connect(
  null,
  {
    createVariable: codebookActions.createVariable,
    changeForm: change,
  },
);

const createNewVariableWindowState = withState(
  'createNewVariable', 'setCreateNewVariable', null,
);

const createNewVariableHandlers = withHandlers({
  handleCreateNewVariable: ({
    nodeType,
    createNewVariable,
    setCreateNewVariable,
    createVariable,
    fields,
    form,
    changeForm,
  }) =>
    (configuration) => {
      const { variable } = createVariable('node', nodeType, configuration);
      const attributeName = `${fields.name}[${createNewVariable}]`;
      changeForm(form, attributeName, { variable, value: null });
      setCreateNewVariable(null);
    },
  openNewVariableWindow: ({ setCreateNewVariable }) =>
    (index) => {
      setCreateNewVariable(index);
    },
  handleCancelCreateNewVariable: ({ setCreateNewVariable }) =>
    () => {
      setCreateNewVariable(null);
    },
});

const createNewVariableProps = withProps(
  ({
    createNewVariable,
  }) => ({
    showNewVariableWindow: createNewVariable !== null,
  }),
);

const withAssignAttributesHandlers = compose(
  createNewVariableState,
  createNewVariableWindowState,
  createNewVariableProps,
  createNewVariableHandlers,
);

export default withAssignAttributesHandlers;
