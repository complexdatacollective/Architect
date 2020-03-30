import { connect } from 'react-redux';
import { getNodeTypeOptions } from '@selectors/codebook';

const mapStateToProps = state => ({
  nodeTypes: getNodeTypeOptions(state),
});

const withNodeTypeOptions = connect(mapStateToProps);

export default withNodeTypeOptions;
