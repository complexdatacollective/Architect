import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose, withStateHandlers, defaultProps } from 'recompose';
import { SortableContainer } from 'react-sortable-hoc';
import cx from 'classnames';
import { getCSSVariableAsNumber } from '@codaco/ui/lib/utils/CSSVariables';
import { getStageList } from '@selectors/protocol';
import { actionCreators as stageActions } from '@modules/protocol/stages';
import { actionCreators as dialogsActions } from '@modules/dialogs';
import { actionCreators as uiActions } from '@modules/ui';
import Stage from './Stage';
import InsertButton from './InsertButton';

const variants = {
  outer: {
    show: {
      background: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0) 100%, var(--background) 100%, var(--background) 100% )',
      transition: {
        duration: 0.5,
        delay: 0.75,
      },
    },
    hide: {
      background: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0) 0%, var(--background) 0%, var(--background) 100% )',
    },
  },
  newStage: {
    show: {
      opacity: 1,
      transition: {
      },
    },
    hide: {
      opacity: 0,
    },
  },
};

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

  handleInsertStage = (index) => this.props.openScreen('newStage', { insertAtIndex: index });

  handleDeleteStage = (stageId) => {
    this.props.openDialog({
      type: 'Warning',
      title: 'Delete stage',
      message: 'Are you sure you want to delete this stage from your protocol? This action cannot be undone!',
      onConfirm: () => { this.props.deleteStage(stageId); },
      confirmLabel: 'Delete stage',
    });
  }

  handleEditStage = (id, origin) => {
    const { openScreen, locus } = this.props;
    openScreen('stage', { locus, id, origin });
  };

  createStage = (type, insertAtIndex) => {
    const { openScreen, locus } = this.props;
    this.setState({ insertStageAtIndex: null, highlightHide: true });
    openScreen('stage', { type, insertAtIndex, locus });
  };

  hasStages = () => this.props.stages.length > 0;

  renderStages = () => this.props.stages.flatMap((stage, index) => ([
    <InsertButton
      key={`insert_${index}`}
      onClick={() => this.handleInsertStage(index)}
    />,
    this.renderStage(stage, index),
  ]));

  renderStage = (stage, index) => (
    <Stage
      key={`stage_${stage.id}`}
      index={index}
      stageNumber={index + 1} // Because SortableElement strips index prop
      id={stage.id}
      type={stage.type}
      hasFilter={stage.hasFilter}
      hasSkipLogic={stage.hasSkipLogic}
      label={stage.label}
      onMouseEnter={this.handleMouseEnterStage}
      onMouseLeave={this.handleMouseLeaveStage}
      onEditStage={this.handleEditStage}
      onDeleteStage={this.handleDeleteStage}
    />
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
      <div
        className={timelineStyles}
      >
        <motion.div
          className="timeline__stages"
          initial={sorting ? false : 'hide'}
          variants={variants.outer}
        >
          { this.renderStages() }
          <motion.div
            className="timeline__insert timeline__insert--new"
            onClick={() => this.handleInsertStage()}
            variants={variants.newStage}
          >
            Add new stage
          </motion.div>
        </motion.div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  locus: state.protocol.timeline[state.protocol.timeline.length - 1],
  activeProtocol: state.session.activeProtocol,
  stages: getStageList(state),
  transitionDuration: getCSSVariableAsNumber('--animation-duration-standard-ms'), // Re-order transition
});

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
  withStateHandlers(
    ({ sorting = false }) => ({
      sorting,
    }),
    {
      setSorting: () => (sortingState) => ({
        sorting: sortingState,
      }),
    },
  ),
  defaultProps({
    lockAxis: 'y',
    distance: 5,
    helperClass: 'timeline__sortable-element',
  }),
  connect(mapStateToProps, mapDispatchToProps),
  SortableContainer,
)(Timeline);
