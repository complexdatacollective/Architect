/* eslint-disable */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import TimelineStage from './TimelineStage';
import TimelineAddNew from './TimelineAddNew';

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
    <span
      key={item.id}
    >
      <TimelineStage
        {...item}
        onEditStage={() => this.props.onEditStage(item.id)}
        onEditSkip={() => this.props.onEditSkip(item.id)}
      />
      <TimelineAddNew
        onInsertStage={() => this.props.onInsertStage(index + 1)}
      />
    </span>
  );

  render() {
    const items = this.props.items.map(this.renderItem);

    return (
      <div className="timeline">
        {items}
      </div>
    );
  }
}

export default Timeline;
