import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Zoom } from '../../../behaviours';
import timelineImages from '../../../images/timeline';

const getTimelineImage = type =>
  get(timelineImages, type);

const StageType = Zoom(
  ({ type, onSelectStageType, onMouseEnterStageType, onMouseLeaveStageType }) => {
    const image = getTimelineImage(type);

    return (
      <div
        key={type}
        className="timeline-insert-stage__option"
        onClick={onSelectStageType}
        onMouseEnter={onMouseEnterStageType}
        onMouseLeave={onMouseLeaveStageType}
      >
        <h3>{ type }</h3>
        <div
          className="timeline-insert-stage__option-screen"
        >
          { image && <img className="timeline-insert-stage__option-preview" src={image} alt={type} /> }
          { !image && <div className="timeline-insert-stage__option-description">{type} Interface</div> }
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

  renderOption = ({ type }, index) => (
    <StageType
      key={`${type}_${index}`}
      type={type}
      zoomColors={['#2d2955', '#ffffff']}
      onSelectStageType={() => this.props.handleOptionSelected(type)}
      onMouseEnterStageType={() => this.props.handleOptionActive(index)}
      onMouseLeaveStageType={() => this.props.handleOptionInactive()}
    />
  );

  render() {
    const options = this.props.options;

    return (
      <div className="timeline-insert-stage__options">
        { options.map(this.renderOption) }
      </div>
    );
  }
}

export { Options };

export default Options;
