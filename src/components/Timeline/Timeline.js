import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import cx from 'classnames';
import None from '../Transitions/None';
import Drawer from '../Transitions/Drawer';
import Stage from './Stage';
import InsertStage from './InsertStage';
import constrain from '../../behaviours/constrain';
import { getProtocol } from '../../selectors/protocol';
import { actionCreators as stageActions } from '../../ducks/modules/protocol/stages';

class Timeline extends Component {
  static propTypes = {
    stages: PropTypes.array,
    overview: PropTypes.object,
    onCreateStage: PropTypes.func,
    onEditStage: PropTypes.func,
    deleteStage: PropTypes.func.isRequired,
    onEditSkipLogic: PropTypes.func,
  };

  static defaultProps = {
    stages: [],
    overview: {},
    onCreateStage: () => {},
    onEditStage: () => {},
    onEditSkipLogic: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      highlightY: 0,
      highlightHide: false,
      insertStageAtIndex: null,
    };
  }

  onMouseEnterStage = (e) => {
    const offset = e.target.closest('.timeline-stage').offsetTop;
    this.setState({ highlightY: offset, highlightHide: false });
  };

  onMouseLeaveStage = () => {
    this.setState({ highlightHide: true });
  };

  onInsertStage = (index) => {
    this.setState({ insertStageAtIndex: index, highlightHide: true });
  };

  onDeleteStage = (stageId) => {
    // eslint-disable-next-line
    if (confirm('Are you sure you want to remove this stage?')) {
      this.props.deleteStage(stageId);
    }
  }

  onEditStage = stageId =>
    this.goto(`stage/${stageId}`);

  onEditSkipLogic = stageId =>
    this.goto(`skip/${stageId}`);

  goto = (location = '') => {
    const url = `/edit/${this.props.activeProtocol}/${location}`;

    console.log(url);

    this.props.history.push(url);
  }

  handleCancelInsertStage = () => {
    this.setState({ insertStageAtIndex: null, highlightHide: true });
  }

  createStage = (type, index) => {
    this.setState({ insertStageAtIndex: null, highlightHide: true });
    this.props.onCreateStage(type, index);
    this.goto(`stage?type=${type}&insertAtIndex=${insertAtIndex}`);
  };

  hasStages = () => this.props.stages.length > 0;

  injectInsertStage = (items) => {
    const { insertStageAtIndex } = this.state;

    if (insertStageAtIndex !== null) {
      return [
        ...items.slice(0, insertStageAtIndex),
        this.renderInsertStage(insertStageAtIndex),
        ...items.slice(insertStageAtIndex),
      ];
    }

    return items;
  }

  renderInsertStage = insertStageAtIndex => (
    <Drawer
      key={`insert_${insertStageAtIndex}`}
      timeout={1000}
      unmountOnExit
      mountOnEnter
    >
      <InsertStage
        handleSelectStage={type => this.createStage(type, insertStageAtIndex)}
        handleCancel={this.handleCancelInsertStage}
      />
    </Drawer>
  );

  renderHighlight = () => {
    const opacity = this.state.highlightHide ? 0 : 1;
    const transform = this.state.highlightHide ? 'translateY(0px)' : `translateY(${this.state.highlightY}px)`;

    const highlightStyles = {
      transform,
      opacity,
    };

    return (
      <div
        className="timeline__stages-highlight"
        key="highlight"
        style={highlightStyles}
      />
    );
  }

  renderStages = () => {
    const items = this.props.stages.map(this.renderStage);
    const itemsWithInsertStage = this.injectInsertStage(items);

    return itemsWithInsertStage;
  }

  renderStage = (stage, index) => {
    const className = cx({ 'timeline-stage--flip': index % 2 === 0 });

    return (
      <None key={`stage_${stage.id}`}>
        <Stage
          key={`stage_${stage.id}`}
          id={stage.id}
          type={stage.type}
          label={stage.label}
          className={className}
          onMouseEnter={this.onMouseEnterStage}
          onMouseLeave={this.onMouseLeaveStage}
          onEditStage={() => this.onEditStage(stage.id)}
          onDeleteStage={() => this.onDeleteStage(stage.id)}
          onInsertStage={position => this.onInsertStage(index + position)}
          onEditSkipLogic={() => this.onEditSkipLogic(stage.id)}
        />
      </None>
    );
  }

  render() {
    const { show } = this.props;

    return (
      <div className={cx('timeline', { 'timeline--show': show })}>
        <div className="timeline__stages">
          { this.hasStages() && this.renderHighlight() }
          <TransitionGroup>
            { this.renderStages() }
          </TransitionGroup>
          { !this.hasStages() && (
            <InsertStage
              key="insertStage"
              handleSelectStage={type => this.createStage(type, 0)}
            />
          ) }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const protocol = getProtocol(state);

  return {
    activeProtocol: state.session.activeProtocol,
    stages: protocol ? protocol.stages : [],
  };
};

const mapDispatchToProps = dispatch => ({
  deleteStage: bindActionCreators(stageActions.deleteStage, dispatch),
});

export { Timeline };

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  constrain([60, 0, 0, 0]),
)(Timeline);
