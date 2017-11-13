import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import NetworkRule from '../components/NetworkRule';

const defaultLogic = {
  operator: '',
  value: '',
};

export default class extends PureComponent {
  static propTypes = {
    logic: PropTypes.object.isRequired,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    onChange: () => {},
  }

  constructor(props) {
    super(props);

    this.state = {
      ...defaultLogic,
    };
  }

  componentDidMount() {
    this.loadLogicFromProps();
  }

  onChange = () => {
    this.props.onChange(this.state);
  };

  onUpdateRule = (event, option) => {
    const value = event.target.value;

    this.setState(
      { [option]: value },
      this.onChange,
    );
  };

  loadLogicFromProps() {
    this.setState({
      ...this.props.logic,
    });
  }

  render() {
    return (
      <div className="network-rule">
        <NetworkRule
          options={{ ...this.state }}
          onUpdateRule={this.onUpdateRule}
        />
      </div>
    );
  }
}
