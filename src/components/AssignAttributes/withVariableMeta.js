import { get } from 'lodash';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { withHandlers, compose } from 'recompose';
import { getVariablesForSubject } from '../../selectors/codebook';
import { actionCreators as codebookActions } from '../../ducks/modules/protocol/codebook';

const store = connect(
  (state, { entity, type, form, field }) => {
    const variable = formValueSelector(form)(state, `${field}.variable`);
    const codebookVariables = getVariablesForSubject(state, { entity, type });

    const variableType = get(codebookVariables, [variable, 'type']);
    const options = get(codebookVariables, [variable, 'options']);

    return {
      variableType,
      variable,
      options,
    };
  },
  { deleteVariable: codebookActions.deleteVariable },
);

const handlers = withHandlers({
  handleDelete: ({ fields, entity, type, variable, deleteVariable }) =>
    (index) => {
      fields.remove(index);
      if (variable) {
        deleteVariable(entity, type, variable);
      }
    },
});

export default compose(
  store,
  handlers,
);
