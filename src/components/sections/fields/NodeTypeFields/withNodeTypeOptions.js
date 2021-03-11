import { connect } from 'react-redux';
import { getNodeTypes } from '@selectors/codebook';
import { asOptions } from '@selectors/utils';

const mapStateToProps = (state) => ({
  nodeTypes: asOptions(getNodeTypes(state)),
});

const withNodeTypeOptions = connect(mapStateToProps);

export default withNodeTypeOptions;
