import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Node from '../../../ui/components/Node';

const PreviewNode = ({ label, color, onClick, selected }) => (
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

class NodeSelect extends Component {
  handleClickNode = (value) => {
    this.props.input.onChange(value);
  };

  render() {
    const {
      children,
      options,
      input: {
        value,
      },
    } = this.props;

    const renderedOptions = options.map(
      ({ label, color, value: optionValue }) => (
        <PreviewNode
          key={optionValue}
          label={label}
          color={color}
          onClick={() => this.handleClickNode(optionValue)}
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
  }
}

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

