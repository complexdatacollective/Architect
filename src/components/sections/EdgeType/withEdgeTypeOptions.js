import { connect } from 'react-redux';
import { asOptions, getTypes } from '@selectors/codebook';

const mapStateToProps = (state) => {
  const edgeTypes = getTypes(state)
    .filter(({ subject }) => subject.entity === 'edge');

  return {
    edgeTypes: edgeTypes.map(asOptions('subject.type')),
  };
};

const withEdgeTypeOptions = connect(mapStateToProps);

export default withEdgeTypeOptions;
