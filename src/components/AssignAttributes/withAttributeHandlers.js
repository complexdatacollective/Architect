import { get } from 'lodash';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { withHandlers, compose } from 'recompose';
import { getVariable } from '@selectors/codebook';

const store = connect(
  (state, { form, field }) => {
    const variableId = formValueSelector(form)(state, `${field}.variable`);
    const variable = getVariable(state, { id: variableId });
    const variableType = get(variable, 'properties.type');
    const options = get(variable, 'properties.options');

    return {
      variableType,
      variable: variableId,
      options,
    };
  },
);

const handlers = withHandlers({
  handleDelete: ({ onDelete, index }) =>
    () => onDelete(index),
  handleCreateNew: ({ index, onCreateNew }) =>
    () => onCreateNew(index),
});

export default compose(
  store,
  handlers,
);
