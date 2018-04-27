import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import cx from 'classnames';
import { Zoom } from '../../behaviours';
import { getCSSVariableAsString } from '../../utils/CSSVariables';
import timelineImages from '../../images/timeline';

const zoomColors = [getCSSVariableAsString('--light-background'), '#ffffff'];

const getTimelineImage = type =>
  get(timelineImages, type);

const EditStageButton = Zoom(
  ({
    onEditStage,
    type,
  }) => (
    <div className="timeline-stage__edit-stage">
      <div
        className="timeline-stage__screen"
        role="button"
        onClick={onEditStage}
        tabIndex="0"
      >
        <div className="timeline-stage__screen-preview">
          {
            getTimelineImage(type) &&
            <img
              src={getTimelineImage(type)}
              alt={`${type} Interface`}
              title={`${type} Interface`}
            />
          }
          {
            !getTimelineImage(type) &&
            `${type} Interface`
          }
        </div>
      </div>
    </div>

  ),
);

class TimelineStage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    type: PropTypes.string.isRequired,
    onEditStage: PropTypes.func.isRequired,
    onEditSkipLogic: PropTypes.func.isRequired,
    onInsertStage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    className: '',
  };

  render() {
    const {
      className,
      onEditStage,
      onEditSkipLogic,
      onInsertStage,
      type,
      ...rest
    } = this.props;

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
          zoomColors={zoomColors}
        />
        <div className="timeline-stage__controls">
          <a
            className="timeline-stage__control"
            onClick={() => onInsertStage(-1)}
          >
            <div className="timeline-stage__control-icon">↑</div>
            Add screen before
          </a>
          <a
            className="timeline-stage__control"
            onClick={onEditSkipLogic}
          >
            <div className="timeline-stage__control-icon">&#9881;</div>
            Configure skip logic
          </a>
          <a
            className="timeline-stage__control"
            onClick={() => onInsertStage(1)}
          >
            <div className="timeline-stage__control-icon">↓</div>
            Add screen after
          </a>
        </div>
      </div>
    );
  }
}

export default TimelineStage;
