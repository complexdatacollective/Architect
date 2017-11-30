import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { Button } from 'network-canvas-ui';
import { makeGetStage } from '../selectors/protocol';
import { actionCreators as stageActions } from '../ducks/modules/stages';
import { ProtocolCard } from '../containers/ProtocolCard';
import EditStage from '../components/EditStage';
import { Draft } from '../behaviours';

const defaultStage = {
};

class EditStageContainer extends PureComponent {
  static propTypes = {
    hasChanges: PropTypes.bool,
    stageId: PropTypes.number,
    onComplete: PropTypes.func,
    draft: PropTypes.any.isRequired,
    updateStage: PropTypes.func.isRequired,
    updateDraft: PropTypes.func.isRequired,
  };

  static defaultProps = {
    draft: null,
    stageId: null,
    hasChanges: false,
    onComplete: () => {},
  }

  onSave = () => {
    const stageId = this.props.stageId;

    this.props.updateStage(
      stageId,
      {
        ...this.props.draft,
      },
    );

    this.props.onComplete();
  };

  renderButtons() {
    return [].concat(
      this.props.hasChanges ? [<Button key="save" size="small" onClick={this.onSave}>Save</Button>] : [],
    );
  }

  render() {
    const {
      hasChanges,
      stageId,
      onComplete,
      draft,
      updateStage,
      updateDraft,
      ...rest
    } = this.props;

    return (
      <ProtocolCard
        title="Edit Stage"
        buttons={this.renderButtons()}
        {...rest}
      >
        <EditStage
          stage={draft}
          onChange={this.props.updateDraft}
        />
      </ProtocolCard>
    );
  }
}

function makeMapStateToProps() {
  const getStage = makeGetStage();

  return function mapStateToProps(state, props) {
    const stage = getStage(state, props) || defaultStage;
    return { draft: stage };
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateStage: bindActionCreators(stageActions.updateStage, dispatch),
  };
}

export { EditStageContainer as EditStage };

export default compose(
  connect(makeMapStateToProps, mapDispatchToProps),
  Draft,
)(EditStageContainer);
