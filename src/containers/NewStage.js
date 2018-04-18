import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { ProtocolCard } from '../containers';
import { StaticImage } from '../components';
import { actionCreators as stageActions } from '../ducks/modules/protocol/stages';

const interfaceOptions = [
  {
    type: 'NameGenerator',
    title: 'Name Generator',
    description: '',
  },
  {
    type: 'Sociogram',
    title: 'Sociogram',
    description: '',
  },
  {
    type: 'Ordinal',
    title: 'Ordinal',
    description: '',
  },
  {
    type: 'Categorize',
    title: 'Categorize',
    description: '',
  },
  {
    type: 'Information',
    title: 'Information',
    description: '',
  },
];

class NewStage extends PureComponent {
  static propTypes = {
    onCancel: PropTypes.func,
    addStage: PropTypes.func,
    index: PropTypes.number,
    onComplete: PropTypes.func,
    show: PropTypes.bool,
  };

  static defaultProps = {
    addStage: () => {},
    onComplete: () => {},
    onCancel: () => {},
    id: null,
    index: null,
    show: false,
  }

  onClickStageType = (type) => {
    const index = this.props.index;

    this.props.addStage({ type }, index);

    // TODO: Find another way
    setTimeout(() => this.props.onComplete(index), 50);
  }

  renderOption = ({ type, title, description }) => (
    <div
      key={type}
      className="new-stage__option"
      onClick={() => this.onClickStageType(type)}
    >
      <div className="new-stage__option-preview">
        <StaticImage src={`images/timeline/stage--${type}.png`} />
      </div>
      <div className="new-stage__option-details">
        <h2 className="new-stage__option-title">{ title }</h2>
        <p className="new-stage__option-description">{ description }</p>
      </div>
    </div>
  );

  render() {
    return (
      <ProtocolCard
        show={this.props.show}
        onCancel={this.props.onCancel}
        type="choice"
      >
        <div className="new-stage">
          <div className="new-stage__options">
            {interfaceOptions.map(this.renderOption)}
          </div>
        </div>
      </ProtocolCard>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addStage: bindActionCreators(stageActions.addStage, dispatch),
  };
}

export { NewStage };

export default compose(
  connect(null, mapDispatchToProps),
)(NewStage);
