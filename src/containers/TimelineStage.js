import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class TimelineStage extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    title: PropTypes.string,
    addStage: PropTypes.func,
    editStage: PropTypes.func,
    editSkip: PropTypes.func,
  };

  static defaultProps = {
    width: 0,
    height: 0,
    title: '',
    addStage: () => {},
    editStage: () => {},
    editSkip: () => {},
  };

  snapshotSrc() {
    return `/images/timeline/stage--${this.props.type}.png`;
  }

  render() {
    return (
      <div>
        { this.props.title }
        <div
          role="button"
          onClick={this.props.editStage}
          tabIndex="0"
        >
          <img src={this.snapshotSrc()} alt="" />
        </div>

        <div
          role="button"
          onClick={this.props.addStage}
          tabIndex="0"
        >
          Add Stage
        </div>

        <div
          role="button"
          onClick={this.props.editSkip}
          tabIndex="0"
        >
          Edit skip
        </div>

      </div>
    );
  }
}

export default TimelineStage;
