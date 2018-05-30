import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { get, isNull } from 'lodash';
import { Zoom } from '../../../behaviours';
import timelineImages from '../../../images/timeline';

const getTimelineImage = type =>
  get(timelineImages, type);

const interfaceOptions = [
  {
    type: 'NameGenerator',
    guidance: {
      title: 'Name Generator',
      description: (<p>{'The Name Generator interface is designed to prompt your research participants to name alters. It includes the ability to include external network data in the form of a roster.'}</p>),
    },
  },
  {
    type: 'Sociogram',
    guidance: {
      title: 'Sociogram',
      description: (<div><p>{'The Sociogram interface allows your participants to position alters spatially, either using the concentric circles framework, or a background image of your choosing.'}</p><p>{'It also allows the creation of edges between alters based on any criteria, and the nomination of alters using an boolean variable.'}</p></div>),
    },
  },
  {
    type: 'Ordinal Bin',
    guidance: {
      title: 'Ordinal Bin',
      description: (<p>{'The Ordinal Bin interface allows your participants to quickly assign the value of an ordinal variable to an alter or edge.'}</p>),
    },
  },
  {
    type: 'Categorize',
    guidance: {
      title: 'Categorical Bin',
      description: (<p>{'The Categorical Bin interface allows your participants to quickly assign the value of a categorical variable to an alter or edge.'}</p>),
    },
  },
  {
    type: 'Information',
    guidance: {
      title: 'Information',
      description: (<p>{'The Information Interface allows you to display text and rich media (including pictures, video and audio) to your participants. Use it to introduce your research, help explain interview tasks, or illustrate concepts or ideas.'}</p>),
    },
  },
  {
    type: 'NameGenerator',
    guidance: {
      title: 'Name Generator',
      description: (<p>{'The Name Generator interface is designed to prompt your research participants to name alters. It includes the ability to include external network data in the form of a roster.'}</p>),
    },
  },
  {
    type: 'Sociogram',
    guidance: {
      title: 'Sociogram',
      description: (<div><p>{'The Sociogram interface allows your participants to position alters spatially, either using the concentric circles framework, or a background image of your choosing.'}</p><p>{'It also allows the creation of edges between alters based on any criteria, and the nomination of alters using an boolean variable.'}</p></div>),
    },
  },
  {
    type: 'Ordinal Bin',
    guidance: {
      title: 'Ordinal Bin',
      description: (<p>{'The Ordinal Bin interface allows your participants to quickly assign the value of an ordinal variable to an alter or edge.'}</p>),
    },
  },
  {
    type: 'Categorize',
    guidance: {
      title: 'Categorical Bin',
      description: (<p>{'The Categorical Bin interface allows your participants to quickly assign the value of a categorical variable to an alter or edge.'}</p>),
    },
  },
  {
    type: 'Information',
    guidance: {
      title: 'Information',
      description: (<p>{'The Information Interface allows you to display text and rich media (including pictures, video and audio) to your participants. Use it to introduce your research, help explain interview tasks, or illustrate concepts or ideas.'}</p>),
    },
  },
];

const StageType = Zoom(
  ({ type, onSelectStageType, onMouseEnterStageType, onMouseLeaveStageType }) => {
    const image = getTimelineImage(type);

    return (
      <div
        key={type}
        className="timeline-insert-stage__option"
        onClick={onSelectStageType}
        onMouseEnter={onMouseEnterStageType}
        onMouseLeave={onMouseLeaveStageType}
      >
        <h3>{ type }</h3>
        <div
          className="timeline-insert-stage__option-screen"
        >
          { image && <img className="timeline-insert-stage__option-preview" src={image} alt={type} /> }
          { !image && <div className="timeline-insert-stage__option-description">{type} Interface</div> }
        </div>
      </div>
    );
  },
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

    this.state = {
      activeInterface: null,
      query: '',
    };
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
      key={`${type}_${index}`}
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
      <div className={guidanceClasses} key={index}>
        <h3>{ guidance.title }</h3>
        { guidance.description }
      </div>
    );
  };

  render() {
    const { query } = this.state;

    const guidanceClasses = cx(
      'timeline-insert-stage__guidance',
      {
        'timeline-insert-stage__guidance--is-active': !isNull(this.state.activeInterface),
      },
    );

    return (
      <div className="timeline-insert-stage">
        <div className="timeline-insert-stage__chooser">
          <div className="timeline-insert-stage__filter">
            <input type="text" value={query} onChange={event => this.setState({ query: event.target.value })} />
          </div>
          <div className="timeline-insert-stage__options">
            {
              interfaceOptions
                .filter(item => (query === '' || item.type.toLowerCase().indexOf(query.toLowerCase()) !== -1))
                .map(this.renderOption)
            }
          </div>
        </div>
        <div className={guidanceClasses}>
          <div className="timeline-insert-stage__guidance-introduction">
            <h3>Add a new stage to your interview</h3>
            <p>
              {'Each card on the left represents an "interface" that you can add to your interview as a stage. An interface is a screen that has been designed to collect a specific type of data.'}
            </p>
            <p>
              {'Hover over the cards to see more information about them, and learn which data they are designed to collect.'}
            </p>
          </div>
          {interfaceOptions.map(this.renderGuidance)}
        </div>
      </div>
    );
  }
}

export { InsertStage };

export default InsertStage;
