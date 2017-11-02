import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Button } from 'network-canvas-ui';
import { getProtocol } from '../selectors/protocol';
import NewStage from './NewStage';
import { Timeline, ScreenTransition, CardTransition } from '../components';
import { actionCreators as stageActions } from '../ducks/modules/stages';

const EditSkip = () => null;

const defaultModalState = {
  type: null,
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
      modal: { ...defaultModalState },
    };
  }

  onModalComplete = () => {
    this.setState({
      modal: {
        ...defaultModalState,
      },
    });
  }

  onModalCancel = () => {
    this.setState({
      modal: {
        ...defaultModalState,
        cancel: true,
      },
    });
  }

  showModal = ({ type, ...options }) => {
    this.setState({
      modal: {
        ...defaultModalState,
        type,
        ...options,
      },
    });
  }
  isAnyModalVisible = () => this.state.modal.type !== null;
  isModalVisible = type => this.state.modal.type === type;
  isTimelineVisible = () => !this.isAnyModalVisible();

  render() {
    return (
      <div className={cx('protocol', { 'protocol--has-changes': this.props.hasChanges })}>
        <ScreenTransition
          key="timeline"
          in={this.isTimelineVisible()}
        >
          <Timeline
            stages={this.props.stages}
            onInsertStage={index => this.showModal({ type: 'NEW_STAGE', insertAtIndex: index })}
            hasChanges={this.props.hasChanges}
          />
        </ScreenTransition>

        <div className="protocol__control-bar">
          <Button size="small">Save</Button>
        </div>

        <CardTransition
          key="new-stage"
          in={this.isModalVisible('NEW_STAGE')}
          cancel={this.state.modal.cancel}
        >
          <NewStage
            index={this.state.modal.insertAtIndex}
            onComplete={this.onModalComplete}
            onCancel={this.onModalCancel}
          />
        </CardTransition>

        <CardTransition
          key="edit-skip"
          in={this.isModalVisible('EDIT_SKIP')}
          cancel={this.state.modal.cancel}
        >
          <EditSkip
            stageId={this.state.modal.stageId}
            onComplete={this.onModalComplete}
            onCancel={this.onModalCancel}
          />
        </CardTransition>
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
