import { connect } from 'react-redux';
import { getEdgeTypes } from '@selectors/codebook';
import { asOptions } from '@selectors/utils';

const mapStateToProps = (state) => ({
  edgeTypes: asOptions(getEdgeTypes(state)),
});

const withEdgeTypeOptions = connect(mapStateToProps);

export default withEdgeTypeOptions;
