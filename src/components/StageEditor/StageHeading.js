import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { noop, get } from 'lodash';
import timelineImages from '@app/images/timeline';
import { getStageIndex } from '@selectors/protocol';
import { getFieldId } from '@app/utils/issues';
import scrollTo from '@app/utils/scrollTo';

const getTimelineImage = type =>
  get(timelineImages, type, timelineImages.Default);

const StageHeading = ({
  stageNumber,
  name,
  type,
  toggleCodeView,
  children,
}) => {

  return (
    <div className="stage-editor-section stage-heading">
      <div className="stage-meta">
        <h1>{name}</h1>
        {
          getTimelineImage(type) &&
            <div className="timeline-preview">
              <img
                src={getTimelineImage(type)}
                alt={`${type} interface`}
                title={`${type} interface`}
                // onClick={toggleCodeView}
              />
              <div className="timeline-stage__notch">{stageNumber}</div>
            </div>
        }
      </div>
      <div className="stage-header-sections">
        {children}
      </div>
    </div>
  );
};

StageHeading.propTypes = {
  stageNumber: PropTypes.number,
  name: PropTypes.string,
  type: PropTypes.string,
  toggleCodeView: PropTypes.func,
  children: PropTypes.any,
};

StageHeading.defaultProps = {
  stageNumber: null,
  name: '',
  type: '',
  toggleCodeView: noop,
  children: null,
};

const mapStateToProps = (state, { id }) => {
  const stageIndex = getStageIndex(state, id);
  const stageNumber = stageIndex !== -1 ? stageIndex + 1 : null;
  const formValues = getFormValues('edit-stage')(state);

  return {
    stageNumber,
    name: formValues.label,
    type: formValues.type,
  };
};

export { StageHeading };

export default connect(mapStateToProps)(StageHeading);
