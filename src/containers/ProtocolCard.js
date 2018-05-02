import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../ui/components';
import { Card } from '../containers';

class ProtocolCard extends PureComponent {
  static propTypes = {
    buttons: PropTypes.array,
    onCancel: PropTypes.func,
    children: PropTypes.node,
  };

  static defaultProps = {
    buttons: [],
    onCancel: () => {},
    children: null,
  }

  constructor(props) {
    super(props);

    this.state = { cancel: false };
  }

  onCancel = () => {
    this.setState(
      { cancel: true },
      () => this.props.onCancel(),
    );
  }

  renderButtons() {
    return this.props.buttons.concat([
      <Button key="cancel" size="small" onClick={this.onCancel}>Cancel</Button>,
    ]);
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
        buttons={this.renderButtons()}
        cancel={cancel}
      >
        { this.props.children }
      </Card>
    );
  }
}

export { ProtocolCard };

export default ProtocolCard;
