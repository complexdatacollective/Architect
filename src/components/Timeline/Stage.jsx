/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { SortableElement } from 'react-sortable-hoc';
import cx from 'classnames';
import { Button } from '@codaco/ui';
import { motion } from 'framer-motion';
import DeleteIcon from '@material-ui/icons/DeleteRounded';
import getAbsoluteBoundingRect from '@app/utils/getAbsoluteBoundingRect';
import EditStageButton from './EditStageButton';

const findPos = (node) => {
  let curtop = 0;
  let curtopscroll = 0;
  let n = node;
  do {
    curtop += n.offsetTop;
    curtopscroll += n.offsetParent ? n.offsetParent.scrollTop : 0;
    n = n.offsetParent;
  } while (n.offsetParent);
  return curtop - curtopscroll;
};

const variants = {
  show: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', delay: 0.75 },
  },
  hide: {
    scale: 0,
    opacity: 0,
  },
};

const Stage = ({
  id,
  stageNumber,
  className,
  onEditStage,
  onDeleteStage,
  type,
  label,
  hasSkipLogic,
  hasFilter,
}) => {
  const componentClasses = cx(
    'timeline-stage',
    className,
  );

  const previewRef = useRef();

  const handleEditStage = () => {
    if (!previewRef.current) { return; }

    const rect = getAbsoluteBoundingRect(previewRef.current);
    const find = findPos(previewRef.current);

    onEditStage(id, {
      ...rect,
      top: find,
    });
  };

  return (
    <motion.div
      className={componentClasses}
      variants={variants}
    >
      <div
        className="timeline-stage__notch"
        onClick={handleEditStage}
      >
        {stageNumber}
      </div>
      <EditStageButton
        ref={previewRef}
        onEditStage={handleEditStage}
        type={type}
        label={label}
        hasSkipLogic={hasSkipLogic}
        hasFilter={hasFilter}
      />
      <div className="timeline-stage__controls">
        <Button
          size="small"
          color="neon-coral"
          icon={<DeleteIcon />}
          onClick={() => onDeleteStage(id)}
          title="Delete stage"
        >
          Delete stage
        </Button>
      </div>
    </motion.div>
  );
};

Stage.propTypes = {
  id: PropTypes.string.isRequired,
  stageNumber: PropTypes.number.isRequired,
  className: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  hasSkipLogic: PropTypes.bool,
  hasFilter: PropTypes.bool,
  onEditStage: PropTypes.func.isRequired,
  onDeleteStage: PropTypes.func.isRequired,
};

Stage.defaultProps = {
  label: '',
  className: '',
  hasFilter: false,
  hasSkipLogic: false,
};

export { Stage as UnconnectedStage };

export default SortableElement(Stage);
