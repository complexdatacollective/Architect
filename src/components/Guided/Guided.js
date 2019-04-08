import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Guidance from './Guidance';
import { getGuidance } from '../../selectors/guidance';
import { getContent } from '../../selectors/locales';
import { actionCreators as uiActions } from '../../ducks/modules/ui';

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
    guidance: PropTypes.shape({
      content: PropTypes.node,
      id: PropTypes.string,
    }).isRequired,
    updateGuidance: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired,
    /* defaultGuidance is used in mapStateToProps */
    // eslint-disable-next-line react/no-unused-prop-types
    defaultGuidance: PropTypes.string,
  };

  static defaultProps = {
    children: null,
    className: '',
    defaultGuidance: null,
  };

  get guidance() {
    return this.props.guidance;
  }

  toggleGuidance = () => {
    this.props.updateGuidance(!this.props.active);
  }

  render() {
    const classNames = cx(
      this.props.className,
      'guided',
      { 'guided--show-guidance': this.props.active },
    );

    return (
      <div className={classNames}>
        <div className="guided__content">
          { this.props.children }
        </div>

        <Guidance
          show={this.props.active}
          handleClickToggle={this.toggleGuidance}
          guidance={this.guidance}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  guidance: getGuidance(state) || getDefaultGuidance(state, props.defaultGuidance),
  active: state.ui.guidance,
});

const mapDispatchToProps = {
  updateGuidance: uiActions.updateGuidance,
};

export { Guided };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Guided);
