import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
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

    if (index) {
      this.props.addStage({ type }, index);
    }

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
        <h2>{ title }</h2>
        <p>{ description }</p>
      </div>
    </div>
  );

  render() {
    return (
      <div className="new-stage" style={{ backgroundColor: 'silver' }}>
        <h1>Add New Screen</h1>
        <div className="new-stage__options">
          {interfaceOptions.map(this.renderOption)}
        </div>
        <button onClick={this.props.onCancel}>cancel</button>
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
