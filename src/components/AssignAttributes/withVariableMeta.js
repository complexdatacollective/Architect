import { get } from 'lodash';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { getVariablesForSubject } from '../../selectors/codebook';

const withVariableMeta = connect(
  (state, { entity, type, form, field }) => {
    const variable = formValueSelector(form)(state, `${field}.variable`);
    const codebookVariables = getVariablesForSubject(state, { entity, type });

    const variableType = get(codebookVariables, [variable, 'type']);
    const options = get(codebookVariables, [variable, 'options']);

    return {
      variableType,
      options,
    };
  },
);

export default withVariableMeta;
