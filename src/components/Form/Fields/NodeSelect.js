import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Node from '../../../ui/components/Node';
import * as Fields from '../../../ui/components/Fields';

const PreviewNode = ({ label, color, input: { value, checked, onChange } }) => (
  <Node onClick={() => onChange(value)} label={label} selected={checked} color={color} />
);

PreviewNode.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.string,
};

PreviewNode.defaultProps = {
  color: 'node-color-seq-1',
};

const NodeSelect = ({ className, ...rest }) => (
  <Fields.RadioGroup
    optionComponent={PreviewNode}
    className={cx('form-node-select', className)}
    {...rest}
  />
);

NodeSelect.propTypes = {
  className: PropTypes.string,
};

NodeSelect.defaultProps = {
  className: '',
};

export default NodeSelect;
