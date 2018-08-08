import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { get, find } from 'lodash';
import { Button } from '../../ui/components';
import { actionCreators as stageActions } from '../../ducks/modules/protocol/stages';
import Card from './ProtocolCard';
import { getProtocol } from '../../selectors/protocol';
import { Draft } from '../../behaviours';
import SkipLogicEditor from '../SkipLogicEditor';

const defaultLogic = {
  action: 'SKIP',
  operator: '',
  value: '',
  filter: {
    join: '',
    rules: [],
  },
};

class EditSkipLogic extends PureComponent {
  static propTypes = {
    show: PropTypes.bool,
    hasChanges: PropTypes.bool,
    stageId: PropTypes.string,
    onComplete: PropTypes.func,
    draft: PropTypes.any.isRequired,
    updateStage: PropTypes.func.isRequired,
    updateDraft: PropTypes.func.isRequired,
  };

  static defaultProps = {
    show: false,
    stageId: null,
    hasChanges: false,
    onComplete: () => {},
  }

  onSave = () => {
    const stageId = this.props.stageId;

    this.props.updateStage(
      stageId,
      {
        skipLogic: this.props.draft,
      },
    );

    this.props.onComplete();
  };

  renderButtons() {
    return [].concat(
      this.props.hasChanges ? [<Button key="save" size="small" onClick={this.onSave}>Continue</Button>] : [],
    );
  }

  render() {
    const {
      show,
      onComplete,
      draft,
      updateDraft,
    } = this.props;

    return (
      <Card
        type="logic"
        buttons={this.renderButtons()}
        show={show}
        onCancel={onComplete}
      >
        <SkipLogicEditor onChange={updateDraft} rules={draft} />
      </Card>
    );
  }
}

const mapStateToProps = (state, props) => {
  const stageId = get(props, 'match.params.id');
  const protocol = getProtocol(state);
  const stage = find(protocol.stages, ['id', stageId]);
  const logic = get(stage, 'skipLogic', defaultLogic);

  return {
    stageId,
    draft: logic,
  };
};

const mapDispatchToProps = dispatch => ({
  updateStage: bindActionCreators(stageActions.updateStage, dispatch),
});

export { EditSkipLogic };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  Draft,
)(EditSkipLogic);
