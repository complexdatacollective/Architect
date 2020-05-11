import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { motion } from 'framer-motion';
import timelineImages from '@app/images/timeline';
import filterIcon from '@app/images/timeline/filter-icon.svg';
import skipLogicIcon from '@app/images/timeline/skip-logic-icon.svg';

const getTimelineImage = type =>
  get(timelineImages, type, timelineImages.Default);

const variants = {
  edit: () => ({
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    transition: { duration: 5 },
  }),
};

const EditStageButton = ({
  onEditStage,
  type,
  label,
  hasSkipLogic,
  hasFilter,
}, ref) => (
  <div
    className="timeline-stage__edit-stage"
    onClick={onEditStage}
  >
    <motion.div
      className="timeline-stage__screen"
      role="button"
      tabIndex="0"
      variants={variants}
      ref={ref}
    >
      <div className="timeline-stage__screen-preview">
        {
          getTimelineImage(type) &&
          <img
            src={getTimelineImage(type)}
            alt={`${type} interface`}
            title={`${type} interface`}
          />
        }
        {
          !getTimelineImage(type) &&
          `${type} Interface`
        }
      </div>
    </motion.div>
    <div className="timeline-stage__meta">
      <h2 className="timeline-stage__title">{label || '\u00A0'}</h2>
      <div className="timeline-stage__icons">
        { hasFilter &&
          <div className="timeline-stage__icon">
            <img src={filterIcon} alt="Filter" title="Filter" />
          </div>
        }
        { hasSkipLogic &&
          <div className="timeline-stage__icon">
            <img src={skipLogicIcon} alt="Skip logic" title="Skip logic" />
          </div>
        }
      </div>
    </div>
  </div>
);

EditStageButton.propTypes = {
  onEditStage: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string,
  hasSkipLogic: PropTypes.bool,
  hasFilter: PropTypes.bool,
};

EditStageButton.defaultProps = {
  label: null,
  hasSkipLogic: false,
  hasFilter: false,
};

export { EditStageButton };

export default React.forwardRef(EditStageButton);
