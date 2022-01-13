import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { getFormValues } from 'redux-form';
import { noop, get } from 'lodash';
import * as Fields from '@codaco/ui/lib/components/Fields';
import timelineImages from '@app/images/timeline';
import { getStageIndex } from '@selectors/protocol';
import { ValidatedField } from '../Form';
import { getFieldId } from '../../utils/issues';

const getTimelineImage = (type) => get(timelineImages, type, timelineImages.Default);

export const CondensedStageHeading = ({
  id,
}) => {
  const stageIndex = useSelector((state) => getStageIndex(state, id));
  const stageNumber = stageIndex !== -1 ? stageIndex + 1 : null;
  const formValues = useSelector(getFormValues('edit-stage'));
  const type = get(formValues, 'type', '');

  return (
    <div className="stage-heading stage-heading--collapsed">
      <div className="stage-meta">
        <img
          src={getTimelineImage(type)}
          alt={`${type} interface`}
          title={`${type} interface`}
        />
      </div>
      <div className="stage-name-container">
        <h2>
          {stageNumber}
          .
          {' '}
          {formValues.label}
        </h2>
      </div>
    </div>
  );
};

CondensedStageHeading.propTypes = {
  id: PropTypes.string.isRequired,
};

const StageHeading = ({
  stageNumber,
  type,
  toggleCodeView,
}) => (
  <div className="stage-heading">
    <div className="stage-meta">
      {
        getTimelineImage(type)
          && (
          <div className="timeline-preview" onClick={toggleCodeView}>
            <img
              src={getTimelineImage(type)}
              alt={`${type} interface`}
              title={`${type} interface`}
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
  </div>
);

StageHeading.propTypes = {
  stageNumber: PropTypes.number,
  type: PropTypes.string,
  toggleCodeView: PropTypes.func,
};

StageHeading.defaultProps = {
  stageNumber: null,
  type: '',
  toggleCodeView: noop,
};

const mapStateToProps = (state, props) => {
  const { id } = props;
  const stageIndex = getStageIndex(state, id);
  const stageNumber = stageIndex !== -1 ? stageIndex + 1 : null;
  const formValues = getFormValues('edit-stage')(state);

  return {
    stageNumber,
    type: get(formValues, 'type', ''),
  };
};

export default connect(mapStateToProps)(StageHeading);
