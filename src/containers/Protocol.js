import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Button } from 'network-canvas-ui';
import { getProtocol } from '../selectors/protocol';
import NewStage from '../containers/NewStage';
import EditSkipLogic from '../containers/EditSkipLogic';
import EditStage from '../containers/EditStage';
import { Timeline } from '../components';
import { actionCreators as protocolSaveActions } from '../ducks/modules/protocol/save';

const cards = {
  newStage: Symbol('newStage'),
  editSkip: Symbol('editSkip'),
};

const defaultActiveCardState = {
  cardType: null,
  cancel: false,
};

class Protocol extends PureComponent {
  static propTypes = {
    stages: PropTypes.array.isRequired,
    hasUnsavedChanges: PropTypes.bool,
    saveProtocol: PropTypes.func.isRequired,
  };

  static defaultProps = {
    hasUnsavedChanges: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeCard: { ...defaultActiveCardState },
    };
  }

  onCardComplete = () => {
    this.setState({
      activeCard: {
        ...defaultActiveCardState,
      },
    });
  }

  onCardCancel = () => {
    this.setState({
      activeCard: {
        ...defaultActiveCardState,
        cancel: true,
      },
    });
  }

  showCard = (card, { ...options }) => {
    this.setState({
      activeCard: {
        ...defaultActiveCardState,
        cardType: card,
        ...options,
      },
    });
  }

  isAnyCardVisible = () => this.state.activeCard.cardType !== null;
  isCardVisible = cardType => this.state.activeCard.cardType === cardType;
  isTimelineVisible = () => !this.isAnyCardVisible();

  render() {
    const protocolClasses = cx(
      'protocol',
      {
        'protocol--has-changes': this.props.hasUnsavedChanges,
      },
    );
    return (
      <div className={protocolClasses}>
        <Timeline
          stages={this.props.stages}
          onInsertStage={insertAtIndex => this.showCard(cards.newStage, { insertAtIndex })}
          onEditSkipLogic={stageId => this.showCard(cards.editSkip, { stageId })}
          onEditStage={stageId => this.showCard(cards.editStage, { stageId })}
          hasUnsavedChanges={this.props.hasUnsavedChanges}
        />

        <div className="protocol__control-bar">
          <Button size="small" onClick={this.props.saveProtocol}>Save</Button>
        </div>

        <NewStage
          index={this.state.activeCard.insertAtIndex}
          show={this.isCardVisible(cards.newStage)}
          cancel={this.state.activeCard.cancel}
          onComplete={this.onCardComplete}
          onCancel={this.onCardCancel}
        />

        <EditSkipLogic
          show={this.isCardVisible(cards.editSkip)}
          cancel={this.state.activeCard.cancel}
          stageId={this.state.activeCard.stageId}
          onComplete={this.onCardComplete}
          onCancel={this.onCardCancel}
        />

        <EditStage
          show={this.isCardVisible(cards.editStage)}
          stageId={this.state.activeCard.stageId}
          onComplete={this.onCardComplete}
          onCancel={this.onCardCancel}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const protocol = getProtocol(state);

  return {
    stages: protocol.stages,
    hasUnsavedChanges: (state.protocol.past.length > state.session.lastSaved),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    saveProtocol: bindActionCreators(protocolSaveActions.saveProtocol, dispatch),
  };
}

export { Protocol };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Protocol);
