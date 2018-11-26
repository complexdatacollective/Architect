import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Node from '../ui/components/Node';
import { getNodeTypes } from '../selectors/variableRegistry';

const mapStateToProps = state => ({
  nodeTypes: getNodeTypes(state),
});

const PreviewNode = ({
  nodeTypes,
  type,
}) => {
  const color = get(nodeTypes, [type, 'color'], 'node-color-seq-1');
  const label = get(nodeTypes, [type, 'label'], '');

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
