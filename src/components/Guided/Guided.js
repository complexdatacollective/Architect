import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

class Guided extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  static defaultProps = {
    children: null,
    className: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      active: null,
      guided: true,
    };
  }

  onShowGuidance = (index) => {
    this.setState({ active: index });
  };

  onToggleGuidance = () => {
    this.setState({ guided: !this.state.guided });
  }

  onResetGuidance = () => {
    this.setState({ active: null });
  };

  renderSections = () =>
    React.Children.toArray(this.props.children)
      .map((child, index) => {
        const isActive = this.state.active === index;

        return React.cloneElement(
          child,
          {
            isActive,
            anyActive: !!this.state.active,
            key: index,
            showGuidance: () => { this.onShowGuidance(index); },
            resetGuidance: this.onResetGuidance,
            toggleGuidance: this.onToggleGuidance,
          },
        );
      });

  render() {
    const classNames = cx(
      this.props.className,
      'guided',
      { 'guided--is-hidden': !this.state.guided },
    );

    return (
      <div className={classNames}>
        { this.renderSections() }
      </div>
    );
  }
}

export default Guided;
