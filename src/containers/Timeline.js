/* eslint-disable */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { map, flatten, zip } from 'lodash';
import { Button } from 'network-canvas-ui';
import TimelineStage from './TimelineStage';
import TimelineAddNew from './TimelineAddNew';

class Timeline extends PureComponent {
  static propTypes = {
    stages: PropTypes.array,
    onInsertStage: PropTypes.func,
    onEditStage: PropTypes.func,
    onEditSkip: PropTypes.func,
  };

  static defaultProps = {
    stages: [],
    onInsertStage: () => {},
    onEditStage: () => {},
    onEditSkip: () => {},
  };

  renderStage = (stage, index) => (
    <TimelineStage
      key={`stage_${stage.id}`}
      id={`stage_${index}`}
      {...stage}
      onEditStage={() => this.props.onEditStage(stage.id)}
      onEditSkip={() => this.props.onEditSkip(stage.id)}
    />
  );

  renderAddNew = (item, index) => (
    <TimelineAddNew
      key={`add-new_${index}`}
      onInsertStage={() => this.props.onInsertStage(index + 1)}
    />
  );

  render() {
    const stages = this.props.stages.map(this.renderStage);
    const addNew = this.props.stages.map(this.renderAddNew);

    const items = flatten(zip(stages, addNew));

    return (
      <div className="timeline">
        <div className="timeline__main">
          <TimelineAddNew
            key={`add-new_0`}
            onInsertStage={() => this.props.onInsertStage(0)}
          />
          {items}
        </div>
        <div className="timeline__control-bar">
          <Button size="small" onClick={this.props.onCancel}>Save</Button>
        </div>
      </div>
    );
  }
}

export default Timeline;
