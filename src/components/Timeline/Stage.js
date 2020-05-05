import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SortableElement } from 'react-sortable-hoc';
import { get } from 'lodash';
import cx from 'classnames';
import { getCSSVariableAsString } from '@codaco/ui/lib/utils/CSSVariables';
import { Zoom } from '@app/behaviours';
import timelineImages from '@app/images/timeline';

const zoomColors = () => [getCSSVariableAsString('--light-background'), '#ffffff'];

const getTimelineImage = type =>
  get(timelineImages, type, timelineImages.Default);

const EditStageButton = Zoom(
  ({
    onEditStage,
    type,
    label,
  }) => (
    <div className="timeline-stage__edit-stage" onClick={onEditStage}>
      <div
        className="timeline-stage__screen"
        role="button"
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
      <h2 className="timeline-stage__edit-stage-title">{label || '\u00A0'}</h2>
    </div>
  ),
);

class Stage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string.isRequired,
    onEditStage: PropTypes.func.isRequired,
    onDeleteStage: PropTypes.func.isRequired,
    onInsertStage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    label: '',
    className: '',
  };

  render() {
    const {
      className,
      onEditStage,
      onDeleteStage,
      onInsertStage,
      type,
      label,
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
          label={label}
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
  }
}

export { Stage };

export default SortableElement(Stage);
