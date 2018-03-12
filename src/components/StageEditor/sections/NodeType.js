import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { OptionsInput } from '../../../components/Form';

const options = [
  'foo',
  'bar',
];

const NodeTypeOption = ({ selected, value }) => (
  <div className="edit-stage-node-type__option">
    {value} {selected && ' (selected)'}
  </div>
);

NodeTypeOption.propTypes = {
  value: PropTypes.string.isRequired,
  selected: PropTypes.bool,
};

NodeTypeOption.defaultProps = {
  selected: false,
};

class NodeType extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    value: '',
    onChange: () => {},
  };

  render() {
    const { value, onChange } = this.props;

    return (
      <div className="edit-stage-node-type">
        NodeType
        Which kind of node dose this NameGenerator create?
        <OptionsInput
          options={options}
          component={NodeTypeOption}
          value={value}
          onChange={onChange}
        />
      </div>
    );
  }
}

export default NodeType;
