import { connect } from 'react-redux';
import { asOption, getTypes, propertyMaps } from '@selectors/codebook';

const mapStateToProps = (state) => {
  const edgeTypes = getTypes(state)
    .filter(({ subject }) => subject.entity === 'edge');

  return {
    edgeTypes: edgeTypes.map(asOption(propertyMaps.entity)),
  };
};

const withEdgeTypeOptions = connect(mapStateToProps);

export default withEdgeTypeOptions;
