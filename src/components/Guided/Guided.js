import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Guidance from './Guidance';
import { getGuidance } from '../../selectors/guidance';
import { getContent } from '../../selectors/locales';

const getDefaultGuidance = (state, defaultGuidanceContentId) => {
  if (defaultGuidanceContentId === null) { return null; }

  return {
    content: getContent(state, defaultGuidanceContentId),
    id: defaultGuidanceContentId,
  };
};

class Guided extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    guidance: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]).isRequired,
    /* defaultGuidance is used in mapStateToProps */
    // eslint-disable-next-line react/no-unused-prop-types
    defaultGuidance: PropTypes.string,
  };

  static defaultProps = {
    children: null,
    className: '',
    defaultGuidance: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      active: true,
    };
  }

  get active() {
    return this.state.active;
  }

  get guidance() {
    return this.props.guidance;
  }

  toggleGuidance = () => {
    this.setState({ active: !this.active });
  }

  render() {
    const classNames = cx(
      this.props.className,
      'guided',
      { 'guided--show-guidance': this.active },
    );

    return (
      <div className={classNames}>
        <div className="guided__content">
          { this.props.children }
        </div>

        <Guidance
          show={this.active}
          handleClickToggle={this.toggleGuidance}
          guidance={this.guidance}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  guidance: getGuidance(state) || getDefaultGuidance(state, props.defaultGuidance),
});

export { Guided };

export default connect(
  mapStateToProps,
)(Guided);
