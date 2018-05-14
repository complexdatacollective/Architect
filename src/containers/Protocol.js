/* eslint-disable */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Button, Icon } from '../ui/components';
import { getProtocol } from '../selectors/protocol';
import EditSkipLogic from '../containers/EditSkipLogic';
import EditStage from '../containers/EditStage';
import { Timeline } from '../components';
import { actionCreators as protocolFileActions } from '../ducks/modules/protocol/file';
import { actionCreators as protocolsActions } from '../ducks/modules/protocols';

const cards = {
  newStage: Symbol('newStage'),
  editSkip: Symbol('editSkip'),
};

const defaultActiveCardState = {
  cardType: null,
  cancel: false,
};

const RightArrow = <Icon name="arrow-right" />;

class Protocol extends PureComponent {
  static propTypes = {
    stages: PropTypes.array.isRequired,
    hasUnsavedChanges: PropTypes.bool,
    hasChanges: PropTypes.bool,
    match: PropTypes.object.isRequired,
    loadProtocol: PropTypes.func.isRequired,
    saveProtocol: PropTypes.func.isRequired,
    exportProtocol: PropTypes.func.isRequired,
  };

  static defaultProps = {
    hasUnsavedChanges: false,
    hasChanges: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeCard: { ...defaultActiveCardState },
    };
  }

  componentDidMount() {
    const protocolPath = decodeURIComponent(this.props.match.params.protocol);
    this.props.loadProtocol(protocolPath);
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

  editStage = stageId => this.showCard(cards.editStage, { stageId });
  createStage = (type, insertAtIndex) => this.showCard(cards.editStage, { type, insertAtIndex });

  isAnyCardVisible = () => this.state.activeCard.cardType !== null;
  isCardVisible = cardType => this.state.activeCard.cardType === cardType;
  isTimelineVisible = () => !this.isAnyCardVisible();

  render() {
    const {
      stages,
      hasChanges,
      hasUnsavedChanges,
      saveProtocol,
      exportProtocol,
    } = this.props;

    const protocolClasses = cx(
      'protocol',
      {
        'protocol--has-changes': hasChanges,
        'protocol--has-unsaved-changes': hasUnsavedChanges,
      },
    );
    return (
      <div className={protocolClasses}>
        <Timeline
          stages={stages}
          onEditSkipLogic={stageId => this.showCard(cards.editSkip, { stageId })}
          onEditStage={this.editStage}
          onCreateStage={this.createStage}
          hasUnsavedChanges={hasUnsavedChanges}
        />

        <div className="protocol__control-bar">
          <Button
            size="small"
            onClick={exportProtocol}
            color="white"
            icon={RightArrow}
            iconPosition="right"
          >
            Export
          </Button>
          { hasUnsavedChanges &&
            <Button
              size="small"
              onClick={saveProtocol}
              color="white"
              icon={RightArrow}
              iconPosition="right"
            >
              Save
            </Button>
          }
        </div>

        <EditSkipLogic
          show={this.isCardVisible(cards.editSkip)}
          cancel={this.state.activeCard.cancel}
          stageId={this.state.activeCard.stageId}
          onComplete={this.onCardComplete}
          onCancel={this.onCardCancel}
        />

        <EditStage
          {...this.state.activeCard} // either index & type, or id
          show={this.isCardVisible(cards.editStage)}
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
    hasChanges: state.protocol.past.length > 0,
    hasUnsavedChanges: (state.session.lastChanged > state.session.lastSaved),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // saveProtocol: bindActionCreators(protocolFileActions.saveProtocol, dispatch),
    // exportProtocol: bindActionCreators(protocolFileActions.exportProtocol, dispatch),
    loadProtocol: bindActionCreators(protocolsActions.loadProtocol, dispatch),
  };
}

export { Protocol };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Protocol);
