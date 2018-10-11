import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { parse as parseQueryString } from 'query-string';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  submit as submitForm,
  isDirty as isFormDirty,
  isInvalid as isFormInvalid,
} from 'redux-form';
import { has, get, find } from 'lodash';
import { Button } from '../../ui/components';
import Card from './ProtocolCard';
import StageEditor from '../../components/StageEditor';
import { getProtocol } from '../../selectors/protocol';
import { actionCreators as stageActions } from '../../ducks/modules/protocol/stages';

class EditStage extends PureComponent {
  static propTypes = {
    dirty: PropTypes.bool.isRequired,
    show: PropTypes.bool.isRequired,
    submitForm: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired,
    stage: PropTypes.object.isRequired,
    stageId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    insertAtIndex: PropTypes.number,
    updateStage: PropTypes.func.isRequired,
    createStage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    stageId: null,
    insertAtIndex: null,
  };

  get isDirty() {
    return this.props.dirty || !has(this.props.stage, 'id');
  }

  get buttons() {
    return this.isDirty ? [
      <Button
        key="continue"
        onClick={this.props.submitForm}
      >Continue</Button>,
    ] : [];
  }

  handleSubmit = (stage) => {
    const { stageId, insertAtIndex } = this.props;

    if (stageId) {
      this.props.updateStage(stageId, stage);
    } else {
      this.props.createStage(stage, insertAtIndex);
    }

    this.props.onComplete();
  }

  handleCancel = this.props.onComplete;

  render() {
    const { stage, show } = this.props;

    return (
      <Card
        buttons={this.buttons}
        show={show}
        onCancel={this.handleCancel}
      >
        <StageEditor
          stage={stage}
          onSubmit={this.handleSubmit}
        />
      </Card>
    );
  }
}

const mapStateToProps = (state, props) => {
  const stageId = get(props, 'match.params.id');
  const protocol = getProtocol(state);
  const query = parseQueryString(props.location.search);
  const stage = find(protocol.stages, ['id', stageId]) || { type: query.type };

  return ({
    stage,
    stageId,
    insertAtIndex: query.insertAtIndex ? parseInt(query.insertAtIndex, 10) : null,
    dirty: isFormDirty('edit-stage')(state),
    invalid: isFormInvalid('edit-stage')(state),
  });
};
const mapDispatchToProps = dispatch => ({
  submitForm: () => dispatch(submitForm('edit-stage')),
  updateStage: bindActionCreators(stageActions.updateStage, dispatch),
  createStage: bindActionCreators(stageActions.createStage, dispatch),
});

export { EditStage };

export default connect(mapStateToProps, mapDispatchToProps)(EditStage);
