/* eslint-disable */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import TimelineStage from './TimelineStage';

class Timeline extends PureComponent {
  static propTypes = {
    items: PropTypes.array,
    onInsertStage: PropTypes.func,
    onEditStage: PropTypes.func,
    onEditSkip: PropTypes.func,
  };

  static defaultProps = {
    items: [],
    onInsertStage: () => {},
    onEditStage: () => {},
    onEditSkip: () => {},
  };

  renderItem = (item, index) => (
    <TimelineStage
      key={item.id}
      index={index}
      {...item}
      onInsertStage={() => this.props.onInsertStage(index + 1)}
      onEditStage={this.props.onEditStage}
      onEditSkip={this.props.onEditSkip}
    />
  );

  render() {
    const items = map(this.props.items, this.renderItem);

    return (
      <div className="timeline">
        {items}
      </div>
    );
  }
}

export default Timeline;
