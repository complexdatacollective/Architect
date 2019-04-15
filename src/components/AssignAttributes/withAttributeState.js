import { get } from 'lodash';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { getCodebook } from '../../selectors/codebook';

const withAttributeState = connect(
  (state, { nodeType, form, field }) => {
    const codebook = getCodebook(state);
    const variable = formValueSelector(form)(state, `${field}.variable`);
    const type = get(codebook, ['node', nodeType, 'variables', variable, 'type']);
    const options = get(codebook, ['node', nodeType, 'variables', variable, 'options']);

    return {
      type,
      options,
    };
  },
);

export default withAttributeState;
