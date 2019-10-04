import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Node from '@ui/components/Node';
import { getTypes } from '@selectors/codebook';

const mapStateToProps = state => ({
  nodeTypes: getTypes(state).filter(({ subject }) => subject.entity === 'node'),
});

const PreviewNode = ({
  nodeTypes,
  type,
}) => {
  const nodeType = nodeTypes.find(({ subject }) => subject.type === type);
  const color = get(nodeType, 'properties.color', 'node-color-seq-1');
  const label = get(nodeType, 'properties.name', '');

  return (
    <Node label={label} color={color} />
  );
};

PreviewNode.propTypes = {
  nodeTypes: PropTypes.object.isRequired,
  type: PropTypes.string,
};

PreviewNode.defaultProps = {
  type: '',
};

export { PreviewNode };

export default connect(
  mapStateToProps,
)(PreviewNode);
