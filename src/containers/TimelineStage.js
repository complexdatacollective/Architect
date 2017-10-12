import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Zoom from '../components/Zoom';

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

        <Zoom>
          <div
            role="button"
            onClick={this.props.addStage}
            tabIndex="0"
            style={{ display: 'inline-block' }}
          >
            Add Stage
          </div>
        </Zoom>

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
