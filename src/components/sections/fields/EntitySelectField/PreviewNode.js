import React from 'react';
import PropTypes from 'prop-types';
import { Node } from '@codaco/ui';
import cx from 'classnames';

const PreviewNode = ({
  label, color, onClick, selected,
}) => (
  <div
    className={cx('preview-node', { 'preview-node--selected': selected }, { 'preview-node--clickable': onClick })}
    onClick={!selected ? onClick : undefined}
  >
    <Node label={label} selected={selected} color={color} />
  </div>
);

PreviewNode.propTypes = {
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  label: PropTypes.string.isRequired,
  color: PropTypes.string,
};

PreviewNode.defaultProps = {
  color: 'node-color-seq-1',
  selected: false,
  onClick: undefined,
};

export default PreviewNode;
