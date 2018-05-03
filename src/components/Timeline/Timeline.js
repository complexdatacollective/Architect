import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
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

  constructor(props) {
    super(props);

    this.state = {
      highlightY: 0,
    };
  }

  onHoverStage = (e) => {
    const offset = e.target.closest('.timeline-stage').offsetTop;
    // debugger;
    this.setState({ highlightY: offset });
  };

  hasStages = () => this.props.stages.length > 0;

  renderHighlight = () => {
    const highlightStyles = { transform: `translateY(${this.state.highlightY}px)` };
    return (<div className="timeline__stages-highlight" key="highlight" style={highlightStyles} />);
  }

  renderStages = () => (
    <Fragment>
      { this.renderHighlight() }
      { this.props.stages.map(this.renderStage) }
    </Fragment>
  );

  renderStage = (stage, index) => (
    <Stage
      key={`stage_${stage.id}`}
      id={stage.id}
      type={stage.type}
      label={stage.label}
      onMouseEnter={this.onHoverStage}
      onEditStage={() => this.props.onEditStage(stage.id)}
      onInsertStage={position => this.props.onInsertStage(index + position)}
      onEditSkipLogic={() => this.props.onEditSkipLogic(stage.id)}
    />
  );

  render() {
    return (
      <div className="timeline">
        <div className="timeline__main">
          <div className="timeline__background" />
          <div className="timeline__content">
            <Overview
              title="My protocol"
            />
            <div className="timeline__stages">
              { this.hasStages() && this.renderStages() }
              { !this.hasStages() && <AddNew onInsertStage={() => this.props.onInsertStage(0)} /> }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { Timeline };

export default constrain([60, 0, 0, 0])(Timeline);
