import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Node from '@codaco/ui/lib/components/Node';
import { useDispatch } from 'react-redux';
import { actionCreators as dialogActions } from '@modules/dialogs';

const PreviewNode = ({
  label, color, onClick, selected,
}) => (
  <div className="preview-node" onClick={onClick}>
    <Node label={label} selected={selected} color={color} />
  </div>
);

PreviewNode.propTypes = {
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  label: PropTypes.string.isRequired,
  color: PropTypes.string,
};

PreviewNode.defaultProps = {
  color: 'node-color-seq-1',
  selected: false,
};

const NodeSelect = (props) => {
  const {
    children,
    options,
    input,
  } = props;

  const { value, onChange } = input;

  const dispatch = useDispatch();

  const handleClickNode = (clickedNode) => {
    if (!value) {
      onChange(clickedNode);
    }
    if (value) {
      dispatch(dialogActions.openDialog({
        type: 'Confirm',
        title: 'Change node type for this stage?',
        message: 'Changing the node type will reset any existing configuration and cannot be undone. Do you want to change the node type?',
        onConfirm: () => onChange(clickedNode),
        confirmLabel: 'Change node type',
      }));
    }
  };

  const renderedOptions = options.map(
    ({ label, color, value: optionValue }) => (
      <PreviewNode
        key={optionValue}
        label={label}
        color={color}
        onClick={() => handleClickNode(optionValue)}
        selected={value === optionValue}
      />
    ),
  );

  return (
    <div className={cx('form-fields-node-select', 'form-node-select')}>
      {renderedOptions}
      {children}
    </div>
  );
};

NodeSelect.propTypes = {
  children: PropTypes.node,
  options: PropTypes.array,
  input: PropTypes.object.isRequired,
};

NodeSelect.defaultProps = {
  children: null,
  options: [],
};

export default NodeSelect;
