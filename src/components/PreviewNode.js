import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Node from '@codaco/ui/lib/components/Node';
import { getNodeTypes } from '../selectors/codebook';

const mapStateToProps = (state) => ({
  nodeTypes: getNodeTypes(state),
});

const PreviewNode = ({
  nodeTypes,
  type,
}) => {
  const color = get(nodeTypes, [type, 'color'], 'node-color-seq-1');
  const label = get(nodeTypes, [type, 'name'], '');

  return (
    <Node label={label} color={color} />
  );
};

PreviewNode.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
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
