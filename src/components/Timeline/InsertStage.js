import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { get, isNull } from 'lodash';
import { Zoom } from '../../behaviours';
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

const StageType = Zoom(
  ({ type, onSelectStageType, onMouseEnterStageType, onMouseLeaveStageType }) => (
    <div
      key={type}
      className="timeline-insert-stage__option"
      onClick={onSelectStageType}
      onMouseEnter={onMouseEnterStageType}
      onMouseLeave={onMouseLeaveStageType}
    >
      <img src={getTimelineImage(type)} alt={type} />
    </div>
  ),
);

class InsertStage extends PureComponent {
  static propTypes = {
    onSelectStageType: PropTypes.func,
  };

  static defaultProps = {
    onSelectStageType: () => {},
  }

  constructor(props) {
    super(props);

    this.state = { activeInterface: null };
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
    <StageType
      type={type}
      zoomColors={['#2d2955', '#ffffff']}
      onSelectStageType={() => this.props.onSelectStageType(type)}
      onMouseEnterStageType={() => this.onMouseEnterStageType(index)}
      onMouseLeaveStageType={() => this.onMouseLeaveStageType()}
    />
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
    const guidanceClasses = cx(
      'timeline-insert-stage__guidance',
      {
        'timeline-insert-stage__guidance--is-active': !isNull(this.state.activeInterface),
      },
    );

    return (
      <div className="timeline-insert-stage">
        <div className="timeline-insert-stage__options">
          {interfaceOptions.map(this.renderOption)}
        </div>
        <div className={guidanceClasses}>
          <div className="timeline-insert-stage__guidance-introduction">
            <h3>Insert a stage here</h3>
            Please choose one of the stages on the left.
          </div>
          {interfaceOptions.map(this.renderGuidance)}
        </div>
      </div>
    );
  }
}

export { InsertStage };

export default InsertStage;
