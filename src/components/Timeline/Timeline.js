import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { flatten, zip } from 'lodash';
import Overview from './Overview';
import Stage from './Stage';
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
      onInsertStage={(position) => this.props.onInsertStage(index + position)}
      onEditSkipLogic={() => this.props.onEditSkipLogic(stage.id)}
    />
  );

  render() {
    const stages = this.props.stages.map(this.renderStage);

    return (
      <div className="timeline">
        <div className="timeline__main">
          <div className="timeline__background" />
          <div className="timeline__content">
            <Overview
              name="foo"
              title="My protocol"
            />
            {stages}
          </div>
        </div>
      </div>
    );
  }
}

export { Timeline };

export default constrain([60, 0, 0, 0])(Timeline);
