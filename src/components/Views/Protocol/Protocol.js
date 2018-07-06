import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import { pick } from 'lodash';
import { Button, Icon } from '../../../ui/components';
import { getProtocol } from '../../../selectors/protocol';
import ShowRoute from '../../../components/ShowRoute';
import EditSkipLogic from '../../Cards/EditSkipLogic';
import EditStage from '../../Cards/EditStage';
import EditForm from '../../Cards/Form';
import Timeline from '../../../components/Timeline';
import ControlBar from '../../ControlBar';
import { actionCreators as protocolFileActions } from '../../../ducks/modules/protocol/file';

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
    overview: PropTypes.shape({
      title: PropTypes.string,
      version: PropTypes.string,
      forms: PropTypes.object,
      variableRegistry: PropTypes.object,
    }).isRequired,
    stages: PropTypes.array.isRequired,
    hasUnsavedChanges: PropTypes.bool,
    hasChanges: PropTypes.bool,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    loadProtocol: PropTypes.func.isRequired,
    saveProtocol: PropTypes.func.isRequired,
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

  editStage = (stageId) => {
    if (!this.props.stages.find(({ id }) => id === stageId)) {
      throw new Error(stageId);
    }

    this.showCard(cards.editStage, { stageId });
  };

  createStage = (type, insertAtIndex) => this.showCard(cards.editStage, { type, insertAtIndex });

  isAnyCardVisible = () => this.state.activeCard.cardType !== null;
  isCardVisible = cardType => this.state.activeCard.cardType === cardType;
  isTimelineVisible = () => !this.isAnyCardVisible();

  render() {
    const {
      overview,
      stages,
      location,
      hasChanges,
      hasUnsavedChanges,
      saveProtocol,
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
          overview={overview}
          stages={stages}
          onEditSkipLogic={stageId => this.showCard(cards.editSkip, { stageId })}
          onEditStage={this.editStage}
          onCreateStage={this.createStage}
          hasUnsavedChanges={hasUnsavedChanges}
        />

        <ControlBar show={hasUnsavedChanges}>
          <Button
            size="small"
            onClick={saveProtocol}
            color="white"
            icon={RightArrow}
            iconPosition="right"
          >
            Save
          </Button>
        </ControlBar>

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

        <ShowRoute
          path="/edit/:protocol/form/:form?"
          location={location}
          history={history}
          component={EditForm}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const protocol = getProtocol(state);
  const overview = pick(protocol, ['name', 'version', 'variableRegistry', 'externalData', 'forms']);

  return {
    overview,
    stages: protocol.stages,
    hasChanges: state.protocol.past.length > 0,
    hasUnsavedChanges: (state.session.lastChanged > state.session.lastSaved),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    saveProtocol: bindActionCreators(protocolFileActions.saveProtocol, dispatch),
    loadProtocol: bindActionCreators(protocolFileActions.loadProtocol, dispatch),
  };
}

export { Protocol };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Protocol);
