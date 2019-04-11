
import { compose, withState, withHandlers, withProps } from 'recompose';

const createNewVariableState = withState(
  'createNewVariable', 'setCreateNewVariable', null,
);

const createNewVariableHandlers = withHandlers({
  handleCreateNewVariable: ({ setCreateNewVariable }) =>
    (submit) => {
      console.log(submit);
      setCreateNewVariable(null);
    },
  openCreateNewVariable: ({ setCreateNewVariable }) =>
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
    showCreateNewVariable: createNewVariable !== null,
  }),
);

const withCreateNewVariable = compose(
  createNewVariableState,
  createNewVariableProps,
  createNewVariableHandlers,
);

export default withCreateNewVariable;
