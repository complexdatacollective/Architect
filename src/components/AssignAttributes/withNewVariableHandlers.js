
import { compose, withState, withHandlers, withProps } from 'recompose';

const createNewVariableWindowState = withState(
  'createNewVariableAtIndex', 'setCreateNewVariableAtIndex', null,
);

const createNewVariableHandlers = withHandlers({
  handleCreateNewVariable: ({
    setCreateNewVariableAtIndex,
    createNewVariableAtIndex,
    fields,
  }) =>
    (variable) => {
      const newAttribute = { variable, value: null };
      fields.splice(createNewVariableAtIndex, 1, newAttribute);
      setCreateNewVariableAtIndex(null);
    },
  openNewVariableWindow: ({ setCreateNewVariableAtIndex }) =>
    index => setCreateNewVariableAtIndex(index),
  handleCancelCreateNewVariable: ({ setCreateNewVariableAtIndex }) =>
    () => setCreateNewVariableAtIndex(null),
});

const showNewVariableWindow = withProps(
  ({ createNewVariableAtIndex }) => ({
    showNewVariableWindow: createNewVariableAtIndex !== null,
  }),
);

const withAssignAttributesHandlers = compose(
  createNewVariableWindowState,
  createNewVariableHandlers,
  showNewVariableWindow,
);

export default withAssignAttributesHandlers;
