import React from 'react';
import PropTypes from 'prop-types';
import { Node } from '../../ui/components';

const NodeType = ({ label, input: { value, checked, onChange } }) => (
  <Node onClick={() => onChange(value)} label={label} selected={checked} />
);

NodeType.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
};

export { NodeType };
export default NodeType;
