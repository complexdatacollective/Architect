/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { noop, get } from 'lodash';
import * as Fields from '@codaco/ui/lib/components/Fields';
import timelineImages from '@app/images/timeline';
import { getStageIndex } from '@selectors/protocol';
import { ValidatedField } from '../Form';
import { getFieldId } from '../../utils/issues';

const getTimelineImage = (type) => get(timelineImages, type, timelineImages.Default);

const StageHeading = ({
  stageNumber,
  type,
  toggleCodeView,
  children,
}) => (
  <div className="stage-editor-section stage-heading">
    <div className="stage-meta">
      {
        getTimelineImage(type)
          && (
          <div className="timeline-preview">
            <img
              src={getTimelineImage(type)}
              alt={`${type} interface`}
              title={`${type} interface`}
              onClick={toggleCodeView}
            />
            <div className="timeline-stage__notch">{stageNumber}</div>
          </div>
          )
      }
      <div className="stage-name-container">
        <div id={getFieldId('label')} data-name="Stage name" />
        <h2>Stage Name</h2>
        <ValidatedField
          name="label"
          component={Fields.Text}
          placeholder="Enter your stage name here"
          className="stage-editor-section-title"
          maxLength="50"
          validation={{ required: true }}
        />
      </div>
    </div>
    <div className="stage-header-sections">
      {children}
    </div>
  </div>
);

StageHeading.propTypes = {
  stageNumber: PropTypes.number,
  type: PropTypes.string,
  toggleCodeView: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.any,
};

StageHeading.defaultProps = {
  stageNumber: null,
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
    type: formValues.type,
  };
};

export default connect(mapStateToProps)(StageHeading);
