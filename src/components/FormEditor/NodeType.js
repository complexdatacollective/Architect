import React from 'react';
import PropTypes from 'prop-types';
import { Node } from '../../ui/components';

const NodeType = ({
  label,
  color,
  input: { value, checked, onChange },
}) => (
  <div className="node-type" onClick={() => onChange(value)}>
    <Node
      label={label}
      selected={checked}
      color={color}
    />
  </div>
);

NodeType.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.string,
};

NodeType.defaultProps = {
  color: '',
};

export { NodeType };
export default NodeType;
