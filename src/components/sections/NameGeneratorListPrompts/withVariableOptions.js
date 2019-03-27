import { connect } from 'react-redux';
import { getVariableOptionsForNodeType } from '../../../selectors/codebook';


const mapStateToProps = (state, { nodeType }) => {
  const variableOptions = getVariableOptionsForNodeType(state, nodeType);

  return {
    variableOptions,
  };
};

const withVariableOptions = connect(
  mapStateToProps,
);

export default withVariableOptions;
