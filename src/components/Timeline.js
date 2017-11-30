import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { flatten, zip } from 'lodash';
import { TimelineOverview, TimelineStage, TimelineAddNew } from '../components';
import constrain from '../behaviours/constrain';

class Timeline extends PureComponent {
  static propTypes = {
    stages: PropTypes.array,
    onInsertStage: PropTypes.func,
    onEditStage: PropTypes.func,
    onEditSkipLogic: PropTypes.func,
  };

  static defaultProps = {
    stages: [],
    onInsertStage: () => {},
    onEditStage: () => {},
    onEditSkipLogic: () => {},
  };

  renderStage = (stage, index) => (
    <TimelineStage
      key={`stage_${stage.id}`}
      id={`stage_${index}`}
      {...stage}
      onEditStage={() => this.props.onEditStage(stage.id)}
      onEditSkipLogic={() => this.props.onEditSkipLogic(stage.id)}
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
          <TimelineOverview
            title="My protocol"
          />
          <TimelineAddNew
            key={'add-new_0'}
            onInsertStage={() => this.props.onInsertStage(0)}
          />
          {items}
        </div>
      </div>
    );
  }
}

export { Timeline };

export default constrain([60, 0, 0, 0])(Timeline);
