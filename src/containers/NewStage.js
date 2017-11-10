/* eslint-disable */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { Button } from 'network-canvas-ui';
import Card from './Card';
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
    onCancel: PropTypes.func.isRequired,
    addStage: PropTypes.func.isRequired,
    index: PropTypes.number,
    onComplete: PropTypes.func,
    show: PropTypes.bool,
    cancel: PropTypes.bool,
  };

  static defaultProps = {
    onComplete: () => {},
    id: null,
    index: null,
    show: false,
    cancel: false,
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
    const buttons = [<Button key="cancel" size="small" onClick={this.props.onCancel}>cancel</Button>];

    return (
      <Card
        title="Add New Stage"
        buttons={buttons}
        show={this.props.show}
        cancel={this.props.cancel}
      >
        <div className="new-stage">
          <div className="new-stage__options">
            {interfaceOptions.map(this.renderOption)}
          </div>
        </div>
      </Card>
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
