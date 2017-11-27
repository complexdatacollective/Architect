import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Button } from 'network-canvas-ui';
import { getProtocol } from '../selectors/protocol';
import NewStage from './NewStage';
import EditSkipLogic from './EditSkipLogic';
import { Timeline } from '../components';
import { actionCreators as stageActions } from '../ducks/modules/stages';

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
    hasChanges: PropTypes.bool,
  };

  static defaultProps = {
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

  isAnyCardVisible = () => this.state.activeCard.cardType !== null;
  isCardVisible = cardType => this.state.activeCard.cardType === cardType;
  isTimelineVisible = () => !this.isAnyCardVisible();

  render() {
    return (
      <div className={cx('protocol', { 'protocol--has-changes': this.props.hasChanges })}>
        <Timeline
          stages={this.props.stages}
          onInsertStage={insertAtIndex => this.showCard(cards.newStage, { insertAtIndex })}
          onEditSkipLogic={stageId => this.showCard(cards.editSkip, { stageId })}
          hasChanges={this.props.hasChanges}
        />

        <div className="protocol__control-bar">
          <Button size="small">Save</Button>
        </div>

        <NewStage
          title="Add a new stage"
          index={this.state.activeCard.insertAtIndex}
          show={this.isCardVisible(cards.newStage)}
          cancel={this.state.activeCard.cancel}
          onComplete={this.onCardComplete}
          onCancel={this.onCardCancel}
        />

        <EditSkipLogic
          title="Edit skip logic"
          show={this.isCardVisible(cards.editSkip)}
          cancel={this.state.activeCard.cancel}
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
    hasChanges: (state.protocol.past.length > 0),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addStage: bindActionCreators(stageActions.addStage, dispatch),
  };
}

export { Protocol };
export default connect(mapStateToProps, mapDispatchToProps)(Protocol);
