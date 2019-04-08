import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { formValueSelector } from 'redux-form';
import { get } from 'lodash';
import { getCodebook, getVariableOptionsForNodeType } from '../../../selectors/codebook';
import { actionCreators as codebookActions } from '../../../ducks/modules/protocol/codebook';

const withDisplayVariableState = connect(
  (state, { form }) => {
    const nodeType = formValueSelector(form)(state, 'subject.type');
    const displayVariableOptions = getVariableOptionsForNodeType(state, nodeType)
      .filter(({ type }) => type === 'text');
    const displayVariable = get(getCodebook(state), ['node', nodeType, 'displayVariable']);

    return {
      nodeType,
      displayVariableOptions,
      displayVariable,
    };
  },
  {
    updateDisplayVariable: codebookActions.updateDisplayVariable,
  },
);

const withDisplayVariableHandlers = withHandlers({
  handleChangeDisplayVariable: ({ nodeType, updateDisplayVariable }) =>
    (variable) => {
      updateDisplayVariable(nodeType, variable);
    },
});


const withDisplayVariableOptions = compose(
  withDisplayVariableState,
  withDisplayVariableHandlers,
);

export default withDisplayVariableOptions;
