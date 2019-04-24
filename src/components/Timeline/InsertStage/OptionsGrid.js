import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Zoom } from '../../../behaviours';
import timelineImages from '../../../images/timeline';

const getTimelineImage = type =>
  get(timelineImages, type);

const StageType = Zoom(
  ({ type, title, onSelectStageType, onMouseEnterStageType, onMouseLeaveStageType }) => {
    const image = getTimelineImage(type);

    return (
      <div
        key={type}
        className="timeline-insert-stage-option-grid__option"
        onClick={onSelectStageType}
        onMouseEnter={onMouseEnterStageType}
        onMouseLeave={onMouseLeaveStageType}
      >
        <h3>{ title }</h3>
        <div
          className="timeline-insert-stage-option-grid__preview"
        >
          { image && <img className="timeline-insert-stage-option-grid__screen" src={image} alt={title} /> }
          { !image && <div className="timeline-insert-stage-option-grid__description">{title} Interface</div> }
        </div>
      </div>
    );
  },
);

class Options extends Component {
  static propTypes = {
    options: PropTypes.array,
    handleOptionSelected: PropTypes.func.isRequired,
    handleOptionActive: PropTypes.func.isRequired,
    handleOptionInactive: PropTypes.func.isRequired,
  };

  static defaultProps = {
    options: [],
  };

  renderOption = ({ type, title }, index) => (
    <StageType
      key={`${type}_${index}`}
      type={type}
      title={title}
      zoomColors={['#2d2955', '#ffffff']}
      onSelectStageType={() => this.props.handleOptionSelected(type)}
      onMouseEnterStageType={() => this.props.handleOptionActive(type)}
      onMouseLeaveStageType={() => this.props.handleOptionInactive()}
    />
  );

  render() {
    const options = this.props.options;

    return (
      <div className="timeline-insert-stage-option-grid">
        { options.map(this.renderOption) }
      </div>
    );
  }
}

export { Options };

export default Options;
