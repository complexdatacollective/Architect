import React from 'react';
import PropTypes from 'prop-types';
import { SortableElement } from 'react-sortable-hoc';
import cx from 'classnames';
import { motion } from 'framer-motion';
import { getCSSVariableAsString } from '@codaco/ui/lib/utils/CSSVariables';
import EditStageButton from './EditStageButton';

const zoomColors = () => [getCSSVariableAsString('--light-background'), '#ffffff'];

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

  return (
    <motion.div
      className={componentClasses}
      exit={{ opacity: 0 }}
    >
      <div
        className="timeline-stage__notch"
        onClick={() => onEditStage(id)}
      >
        {stageNumber}
      </div>
      <EditStageButton
        onEditStage={() => onEditStage(id)}
        type={type}
        label={label}
        hasSkipLogic={hasSkipLogic}
        hasFilter={hasFilter}
        zoomColors={zoomColors()}
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
