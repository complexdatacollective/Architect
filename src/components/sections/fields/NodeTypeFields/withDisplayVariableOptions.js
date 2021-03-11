import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { formValueSelector } from 'redux-form';
import { get, toPairs } from 'lodash';
import { getCodebook, getVariablesForSubject } from '@selectors/codebook';
import { actionCreators as codebookActions } from '@modules/protocol/codebook';

const withDisplayVariableState = connect(
  (state, { form }) => {
    const subject = formValueSelector(form)(state, 'subject');
    const entity = subject && subject.entity;
    const type = subject && subject.type;
    // TODO: isUsed not sure options needed here
    const displayVariableOptions = toPairs(getVariablesForSubject(state, { entity, type }))
      .filter(([, { type: variableType }]) => variableType === 'text');
    const displayVariable = get(getCodebook(state), [entity, type, 'displayVariable']);

    return {
      ...subject,
      displayVariableOptions,
      displayVariable,
    };
  },
  {
    updateDisplayVariable: codebookActions.updateDisplayVariable,
  },
);

const withDisplayVariableHandlers = withHandlers({
  handleChangeDisplayVariable: ({ entity, type, updateDisplayVariable }) => (variable) => {
    updateDisplayVariable(entity, type, variable);
  },
});

const withDisplayVariableOptions = compose(
  withDisplayVariableState,
  withDisplayVariableHandlers,
);

export default withDisplayVariableOptions;
