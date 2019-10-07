import { connect } from 'react-redux';
import { asOption, getTypes, propertyMaps } from '@selectors/codebook';

const mapStateToProps = (state) => {
  const nodeTypes = getTypes(state)
    .filter(({ subject }) => subject.entity === 'node');

  return {
    nodeTypes: nodeTypes.map(asOption(propertyMaps.entity)),
  };
};

const withNodeTypeOptions = connect(mapStateToProps);

export default withNodeTypeOptions;
