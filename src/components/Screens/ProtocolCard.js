import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../ui/components';
import Card from '../Card';

class ProtocolCard extends PureComponent {
  static propTypes = {
    buttons: PropTypes.array,
    onCancel: PropTypes.func,
    children: PropTypes.node,
  };

  static defaultProps = {
    buttons: [],
    onCancel: null,
    children: null,
  }

  constructor(props) {
    super(props);

    this.state = { cancel: false };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.show) {
      this.setState({ cancel: false });
    }
  }

  get buttons() {
    const buttons = this.props.onCancel ?
      [<Button key="cancel" color="platinum" onClick={this.handleCancel}>Cancel</Button>] :
      [];
    return this.props.buttons.concat(buttons);
  }

  handleCancel = () => {
    this.setState(
      { cancel: true },
      () => this.props.onCancel(),
    );
  }

  render() {
    const {
      children,
      ...rest
    } = this.props;
    const cancel = this.state.cancel;

    return (
      <Card
        {...rest}
        onAcknowledgeError={this.handleCancel}
        buttons={this.buttons}
        style={cancel ? 'wipe' : 'fade'}
      >
        { children }
      </Card>
    );
  }
}

export { ProtocolCard };

export default ProtocolCard;
