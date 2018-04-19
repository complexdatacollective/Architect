import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { flatten, zip } from 'lodash';
import Overview from './Overview';
import Stage from './Stage';
import AddNew from './AddNew';
import constrain from '../../behaviours/constrain';

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
    <Stage
      key={`stage_${stage.id}`}
      id={`stage_${index}`}
      {...stage}
      onEditStage={() => this.props.onEditStage(stage.id)}
      onEditSkipLogic={() => this.props.onEditSkipLogic(stage.id)}
    />
  );

  renderAddNew = (item, index) => (
    <AddNew
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
          <div className="timeline__background" />
          <div className="timeline__content">
            <Overview
              name="foo"
              title="My protocol"
            />
            <AddNew
              key={'add-new_0'}
              onInsertStage={() => this.props.onInsertStage(0)}
            />
            {items}
          </div>
        </div>
      </div>
    );
  }
}

export { Timeline };

export default constrain([60, 0, 0, 0])(Timeline);
