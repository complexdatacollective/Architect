import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { SortableElement } from 'react-sortable-hoc';
import cx from 'classnames';
import { motion } from 'framer-motion';
import getAbsoluteBoundingRect from '@app/utils/getAbsoluteBoundingRect';
import EditStageButton from './EditStageButton';

const findPos = (node) => {
  let curtop = 0;
  let curtopscroll = 0;
  if (node.offsetParent) {
    do {
      curtop += node.offsetTop;
      curtopscroll += node.offsetParent ? node.offsetParent.scrollTop : 0;
    } while (node = node.offsetParent);
  }
  return curtop - curtopscroll;
};

const variants = {
  exit: {
    opacity: 0, transition: { duration: 5 },
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
      exit="exit"
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
        <a
          className="timeline-stage__control"
          onClick={() => onDeleteStage(id)}
        >
          <div className="timeline-stage__control-icon">✕</div>
          Delete stage
        </a>
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

export { Stage };

export default SortableElement(Stage);
