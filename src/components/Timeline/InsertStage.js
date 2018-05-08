import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { get } from 'lodash';
import { actionCreators as stageActions } from '../../ducks/modules/protocol/stages';
import timelineImages from '../../images/timeline';

const getTimelineImage = type =>
  get(timelineImages, type);

const interfaceOptions = [
  {
    type: 'NameGenerator',
    guidance: {
      title: 'Name Generator',
      description: 'Unfortunately, that is wrong; on the contrary, a parenthesis sees a slip as a teenage spain. The literature would have us believe that a duckbill knowledge is not but an option.',
    },
  },
  {
    type: 'Sociogram',
    guidance: {
      title: 'Sociogram',
      description: "Extending this logic, an unsealed river's card comes with it the thought that the reasoned stock is a forgery. A probing millimeter without hots is truly a brian of hydroid ugandas.",
    },
  },
  {
    type: 'Ordinal',
    guidance: {
      title: 'Ordinal',
      description: "This could be, or perhaps an uphill hardhat's owner comes with it the thought that the cerise rail is a buffer. This is not to discredit the idea that a romania sees a meeting as an okay olive.",
    },
  },
  {
    type: 'Categorize',
    guidance: {
      title: 'Categorize',
      description: 'A math is the granddaughter of a direction. Authors often misinterpret the iran as a pappy theory, when in actuality it feels more like a plebby liquid.',
    },
  },
  {
    type: 'Information',
    guidance: {
      title: 'Information',
      description: "Those agreements are nothing more than dogsleds. A clonic camera's hen comes with it the thought that the mucoid can is an alligator.",
    },
  },
];

class InsertStage extends PureComponent {
  static propTypes = {
    addStage: PropTypes.func,
    index: PropTypes.number,
    onComplete: PropTypes.func,
  };

  static defaultProps = {
    addStage: () => {},
    onComplete: () => {},
    id: null,
    index: null,
    show: false,
  }

  constructor(props) {
    super(props);

    this.state = { activeInterface: null };
  }

  onClickStageType = (type) => {
    const index = this.props.index;

    this.props.addStage({ type }, index);

    // TODO: Find another way, we wait for stage to be added before editing it here...
    setTimeout(() => this.props.onComplete(index), 50);
  }

  onMouseEnterStageType = (index) => {
    this.setState({ activeInterface: index });
  };

  onMouseLeaveStageType = () => {
    this.setState({ activeInterface: null });
  };

  get guidance() {
    return get(interfaceOptions, [this.state.activeInterface, 'guidance'], null);
  }

  renderOption = ({ type }, index) => (
    <div
      key={type}
      className="timeline-insert-stage__option"
      onClick={() => this.onClickStageType(type)}
      onMouseEnter={() => this.onMouseEnterStageType(index)}
      onMouseLeave={() => this.onMouseLeaveStageType()}
    >
      <img src={getTimelineImage(type)} alt={type} />
    </div>
  );

  renderGuidance = ({ guidance }, index) => {
    const guidanceClasses = cx(
      'timeline-insert-stage__guidance-item',
      {
        'timeline-insert-stage__guidance-item--is-active': this.state.activeInterface === index,
      },
    );

    return (
      <div className={guidanceClasses}>
        <h3>{ guidance.title }</h3>
        { guidance.description }
      </div>
    );
  };

  render() {
    return (
      <div className="timeline-insert-stage">
        <div className="timeline-insert-stage__options">
          {interfaceOptions.map(this.renderOption)}
        </div>
        <div className="timeline-insert-stage__guidance">
          {interfaceOptions.map(this.renderGuidance)}
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addStage: bindActionCreators(stageActions.addStage, dispatch),
  };
}

export { InsertStage };

export default compose(
  connect(null, mapDispatchToProps),
)(InsertStage);
