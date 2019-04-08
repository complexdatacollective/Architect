import { connect } from 'react-redux';
import { getNodeTypes, utils } from '../../../selectors/codebook';

const mapStateToProps = state => ({
  nodeTypes: utils.asOptions(getNodeTypes(state)),
});

const withNodeTypeOptions = connect(mapStateToProps);

export default withNodeTypeOptions;
