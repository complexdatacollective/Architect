import { connect } from 'react-redux';
import { getEdgeTypes, utils } from '../../../selectors/codebook';

const mapStateToProps = state => ({
  edgeTypes: utils.asOptions(getEdgeTypes(state)),
});

const withEdgeTypeOptions = connect(mapStateToProps);

export default withEdgeTypeOptions;
