import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import TimelineStage from './TimelineStage';

class Timeline extends PureComponent {
  static propTypes = {
    items: PropTypes.array,
    addStage: PropTypes.func,
    editStage: PropTypes.func,
    editSkip: PropTypes.func,
  };

  static defaultProps = {
    items: [],
    addStage: () => {},
    editStage: () => {},
    editSkip: () => {},
  };

  renderItem = (item, index) => (
    <TimelineStage
      key={item.id}
      {...item}
      addStage={() => this.props.addStage(index)}
      editStage={() => this.props.editStage(index)}
      editSkip={() => this.props.editSkip(index)}
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
