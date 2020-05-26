import React from 'react';
import PropTypes from 'prop-types';
import { SortableElement } from 'react-sortable-hoc';
import cx from 'classnames';
import { getCSSVariableAsString } from '@codaco/ui/lib/utils/CSSVariables';
import EditStageButton from './EditStageButton';

const zoomColors = () => [getCSSVariableAsString('--light-background'), '#ffffff'];

const Stage = ({
  className,
  onEditStage,
  onDeleteStage,
  onInsertStage,
  type,
  label,
  hasSkipLogic,
  hasFilter,
  ...rest
}) => {
  const componentClasses = cx(
    'timeline-stage',
    className,
  );

  return (
    <div className={componentClasses} {...rest}>
      <div
        className="timeline-stage__notch"
        onClick={onEditStage}
      />
      <EditStageButton
        onEditStage={onEditStage}
        type={type}
        label={label}
        hasSkipLogic={hasSkipLogic}
        hasFilter={hasFilter}
        zoomColors={zoomColors()}
      />
      <div className="timeline-stage__controls">
        <a
          className="timeline-stage__control"
          onClick={() => onInsertStage(0)}
        >
          <div className="timeline-stage__control-icon">↑</div>
          Add stage before
        </a>
        <a
          className="timeline-stage__control"
          onClick={onDeleteStage}
        >
          <div className="timeline-stage__control-icon">✕</div>
          Delete stage
        </a>
        <a
          className="timeline-stage__control"
          onClick={() => onInsertStage(1)}
        >
          <div className="timeline-stage__control-icon">↓</div>
          Add stage after
        </a>
      </div>
    </div>
  );
};

Stage.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  hasSkipLogic: PropTypes.bool,
  hasFilter: PropTypes.bool,
  onEditStage: PropTypes.func.isRequired,
  onDeleteStage: PropTypes.func.isRequired,
  onInsertStage: PropTypes.func.isRequired,
};

Stage.defaultProps = {
  label: '',
  className: '',
  hasFilter: false,
  hasSkipLogic: false,
};

export { Stage };

export default SortableElement(Stage);
