import React, { useCallback } from 'react';
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

const Timeline = (props) => {
  const {
    show,
    sorting,
    stages,
    openScreen,
    locus,
    openDialog,
    deleteStage,
  } = props;

  const handleInsertStage = (index) => {
    openScreen('newStage', { insertAtIndex: index });
  };

  const handleDeleteStage = (stageId) => {
    openDialog({
      type: 'Warning',
      title: 'Delete stage',
      message: 'Are you sure you want to delete this stage from your protocol? This action cannot be undone!',
      onConfirm: () => deleteStage(stageId),
      confirmLabel: 'Delete stage',
    });
  };

  const handleEditStage = (id, origin) => {
    openScreen('stage', { locus, id, origin });
  };

  const renderStages = useCallback(() => stages.flatMap((stage, index) => ([
    <InsertButton
      key={`insert_${index}`}
      onClick={() => handleInsertStage(index)}
    />,
    <Stage
      key={`stage_${stage.id}`}
      index={index}
      stageNumber={index + 1} // Because SortableElement strips index prop
      id={stage.id}
      type={stage.type}
      hasFilter={stage.hasFilter}
      hasSkipLogic={stage.hasSkipLogic}
      label={stage.label}
      onEditStage={handleEditStage}
      onDeleteStage={handleDeleteStage}
    />,
  ])), [stages, handleInsertStage]);

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
        animate="show"
        variants={variants.outer}
      >
        { renderStages() }
        <motion.div
          className="timeline__insert timeline__insert--new"
          onClick={() => handleInsertStage(stages.length)}
          variants={variants.newStage}
        >
          Add new stage
        </motion.div>
      </motion.div>
    </div>
  );
};

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

Timeline.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  stages: PropTypes.array,
  sorting: PropTypes.bool,
  deleteStage: PropTypes.func.isRequired,
  openDialog: PropTypes.func.isRequired,
  openScreen: PropTypes.func.isRequired,
  show: PropTypes.bool,
  locus: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

Timeline.defaultProps = {
  show: true,
  sorting: false,
  stages: [],
};

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
