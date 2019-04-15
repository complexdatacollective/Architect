import { connect } from 'react-redux';
import { getVariableOptionsForSubject } from '../../../selectors/codebook';

const mapStateToProps = (state, { type, entity }) => {
  const variableOptions = getVariableOptionsForSubject(state, { type, entity });

  const categoricalVariableOptions = variableOptions
    .filter(({ type: variableType }) => variableType === 'categorical');

  return {
    variableOptions,
    categoricalVariableOptions,
  };
};

const withVariableOptions = connect(mapStateToProps);

export default withVariableOptions;
