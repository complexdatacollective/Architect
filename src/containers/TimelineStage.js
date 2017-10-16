import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ZoomElement } from '../components';

class TimelineStage extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    title: PropTypes.string,
    onInsertStage: PropTypes.func.isRequired,
    onEditStage: PropTypes.func.isRequired,
    onEditSkip: PropTypes.func.isRequired,
  };

  static defaultProps = {
    width: 0,
    height: 0,
    title: '',
  };

  snapshotSrc() {
    return `/images/timeline/stage--${this.props.type}.png`;
  }

  render() {
    const {
      title,
      onInsertStage,
      onEditStage,
      onEditSkip,
    } = this.props;

    return (
      <div>
        <div>{ title }</div>
        <div
          role="button"
          onClick={onEditStage}
          tabIndex="0"
        >
          <img src={this.snapshotSrc()} alt="" />
        </div>

        <ZoomElement>
          <div
            role="button"
            onClick={onInsertStage}
            tabIndex="0"
            style={{ display: 'inline-block' }}
          >
            Add Stage
          </div>
        </ZoomElement>

        <div
          role="button"
          onClick={onEditSkip}
          tabIndex="0"
        >
          Edit skip
        </div>

      </div>
    );
  }
}

export default TimelineStage;
