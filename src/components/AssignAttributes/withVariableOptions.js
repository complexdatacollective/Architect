import { connect } from 'react-redux';
import { getVariableOptionsForNodeType } from '../../selectors/codebook';

const mapStateToProps = (state, { nodeType }) => ({
  variableOptions: getVariableOptionsForNodeType(state, nodeType),
});

const withVariableOptions = connect(mapStateToProps);

export default withVariableOptions;
