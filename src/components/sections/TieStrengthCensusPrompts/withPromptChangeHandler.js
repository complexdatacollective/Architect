import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { change } from 'redux-form';

import { actionCreators as codebookActions } from '../../../ducks/modules/protocol/codebook';

const store = connect(null, {
  updateVariable: codebookActions.updateVariable,
  changeForm: change,
});

const handlers = withHandlers({
  handleChangePrompt:
    ({ updateVariable, changeForm, form }) =>
    async ({ createEdge, edgeVariable, variableOptions, ...rest }) => {
      changeForm(form, '_modified', Date.now()); // TODO: can we avoid this?
      await updateVariable(
        'edge',
        createEdge,
        edgeVariable,
        { options: variableOptions },
        true,
      );
      return { edgeVariable, createEdge, ...rest };
    },
});

const withPromptChangeHandler = compose(store, handlers);

export default withPromptChangeHandler;
