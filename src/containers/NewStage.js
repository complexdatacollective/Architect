import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Button } from 'network-canvas-ui';
import { actionCreators as stageActions } from '../ducks/modules/stages';

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
];

class NewStage extends PureComponent {
  static propTypes = {
    addStage: PropTypes.func.isRequired,
    index: PropTypes.number,
    onComplete: PropTypes.func,
    onCancel: PropTypes.func,
  };

  static defaultProps = {
    onComplete: () => {},
    onCancel: () => {},
    id: null,
    index: null,
  }

  onClickStageType = (type) => {
    const index = this.props.index;

    this.props.addStage({ type }, index);

    this.props.onComplete();
  }

  renderOption = ({ type, title, description }) => (
    <div
      key={type}
      className="new-stage__option"
      onClick={() => this.onClickStageType(type)}
    >
      <div className="new-stage__option-preview">
        <img alt="" src={`/images/timeline/stage--${type}.png`} />
      </div>
      <div className="new-stage__option-details">
        <h2 className="new-stage__option-title">{ title }</h2>
        <p className="new-stage__option-description">{ description }</p>
      </div>
    </div>
  );

  render() {
    return (
      <div className="new-stage">
        <div className="new-stage__title-bar">
          <h1 className="new-stage__heading">Add New Screen</h1>
        </div>
        <div className="new-stage__main">
          <div className="new-stage__options">
            {interfaceOptions.map(this.renderOption)}
          </div>
        </div>
        <div className="new-stage__control-bar">
          <Button size="small" onClick={this.props.onCancel}>cancel</Button>
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

export default connect(null, mapDispatchToProps)(NewStage);
