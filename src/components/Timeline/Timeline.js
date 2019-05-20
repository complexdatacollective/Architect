import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { compose, withStateHandlers, defaultProps } from 'recompose';
import { SortableContainer } from 'react-sortable-hoc';
import cx from 'classnames';
import None from '../Transitions/None';
import Stage from './Stage';
import { getProtocol } from '../../selectors/protocol';
import { actionCreators as stageActions } from '../../ducks/modules/protocol/stages';
import { actionCreators as dialogsActions } from '../../ducks/modules/dialogs';
import { actionCreators as uiActions } from '../../ducks/modules/ui';
import { getCSSVariableAsNumber } from '../../ui/utils/CSSVariables';
import NewButton from './NewButton';

class Timeline extends Component {
  static propTypes = {
    stages: PropTypes.array,
    sorting: PropTypes.bool,
    deleteStage: PropTypes.func.isRequired,
    openDialog: PropTypes.func.isRequired,
    openScreen: PropTypes.func.isRequired,
    show: PropTypes.bool,
    locus: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  };

  static defaultProps = {
    show: true,
    sorting: false,
    stages: [],
    overview: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      highlightY: 0,
      highlightHide: false,
      insertStageAtIndex: null,
    };
  }

  handleMouseEnterStage = (e) => {
    const offset = e.target.closest('.timeline-stage').offsetTop;
    this.setState({ highlightY: offset, highlightHide: false });
  };

  handleMouseLeaveStage = () => {
    this.setState({ highlightHide: true });
  };

  handleInsertStage = index =>
    this.props.openScreen('newStage', { insertAtIndex: index });

  handleDeleteStage = (stageId) => {
    this.props.openDialog({
      type: 'Warning',
      title: 'Delete stage',
      message: 'Are you sure you want to remove this stage?',
      onConfirm: () => { this.props.deleteStage(stageId); },
      confirmLabel: 'Delete stage',
    });
  }

  handleEditStage = (id) => {
    const { openScreen, locus } = this.props;
    openScreen('stage', { id, locus });
  };

  handleEditSkipLogic = id =>
    this.props.openScreen('skip', { id });

  createStage = (type, insertAtIndex) => {
    const { openScreen, locus } = this.props;
    this.setState({ insertStageAtIndex: null, highlightHide: true });
    openScreen('stage', { type, insertAtIndex, locus });
  };

  hasStages = () => this.props.stages.length > 0;

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

  renderStages = () =>
    this.props.stages.map(this.renderStage);

  renderStage = (stage, index) => (
    <None key={`stage_${stage.id}`}>
      <Stage
        key={`stage_${stage.id}`}
        index={index}
        id={stage.id}
        type={stage.type}
        label={`${index + 1}. ${stage.label}`}
        onMouseEnter={this.handleMouseEnterStage}
        onMouseLeave={this.handleMouseLeaveStage}
        onEditStage={() => this.handleEditStage(stage.id)}
        onDeleteStage={() => this.handleDeleteStage(stage.id)}
        onInsertStage={position => this.handleInsertStage(index + position)}
        onEditSkipLogic={() => this.handleEditSkipLogic(stage.id)}
      />
    </None>
  );

  render() {
    const { show, sorting } = this.props;

    const timelineStyles = cx(
      'timeline',
      {
        'timeline--show': show,
        'timeline--sorting': sorting,
      },
    );

    return (
      <div className={timelineStyles}>
        <div className="timeline__stages">
          { this.hasStages() && this.renderHighlight() }
          <TransitionGroup>
            { this.renderStages() }
          </TransitionGroup>
        </div>
        <div className="timeline__new" onClick={() => this.handleInsertStage()}>
          <NewButton />
          <div className="timeline__new-label">
            Add new stage
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const protocol = getProtocol(state);

  return {
    locus: state.protocol.timeline[state.protocol.timeline.length - 1],
    activeProtocol: state.session.activeProtocol,
    stages: protocol ? protocol.stages : [],
    transitionDuration: getCSSVariableAsNumber('--animation-duration-standard-ms'),
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  deleteStage: bindActionCreators(stageActions.deleteStage, dispatch),
  openDialog: bindActionCreators(dialogsActions.openDialog, dispatch),
  openScreen: bindActionCreators(uiActions.openScreen, dispatch),
  onSortEnd: ({ oldIndex, newIndex }) => {
    props.setSorting(false);
    dispatch(stageActions.moveStage(oldIndex, newIndex));
  },
  onSortStart: () => {
    props.setSorting(true);
  },
});

export { Timeline };

export default compose(
  withRouter,
  withStateHandlers(
    ({ sorting = false }) => ({
      sorting,
    }),
    {
      setSorting: () => sortingState => ({
        sorting: sortingState,
      }),
    },
  ),
  defaultProps({
    lockAxis: 'y',
    distance: 5,
  }),
  connect(mapStateToProps, mapDispatchToProps),
  SortableContainer,
)(Timeline);
