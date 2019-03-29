import { connect } from 'react-redux';
import { getVariableOptionsForNodeType } from '../../../selectors/codebook';

const mapStateToProps = (state, { nodeType }) => {
  const variableOptionsForNodeType = getVariableOptionsForNodeType(state, nodeType);

  const textOptionsForNodeType = variableOptionsForNodeType
    .filter(({ type }) => type === 'text');

  return {
    options: textOptionsForNodeType,
  };
};

const withOptionsForNodeType = connect(mapStateToProps);

export default withOptionsForNodeType;
