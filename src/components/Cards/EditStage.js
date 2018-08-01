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
    invalid: PropTypes.bool.isRequired,
    show: PropTypes.bool.isRequired,
    continue: PropTypes.func.isRequired,
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

  onUpdate = (stage) => {
    const { stageId, insertAtIndex } = this.props;

    if (stageId) {
      this.props.updateStage(stageId, stage);
    } else {
      this.props.createStage(stage, insertAtIndex);
    }

    this.props.onComplete();
  }

  get isDirty() {
    return this.props.dirty || !has(this.props.stage, 'id');
  }

  renderButtons() {
    return [].concat(
      this.isDirty ? [<Button key="continue" size="small" disabled={this.props.invalid} onClick={this.props.continue}>Continue</Button>] : [],
    );
  }

  render() {
    const { stage, show } = this.props;

    return (
      <Card
        buttons={this.renderButtons()}
        show={show}
        onCancel={this.props.onComplete}
      >
        <StageEditor
          stage={stage}
          onSubmit={this.onUpdate}
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
    insertAtIndex: get(query, 'insertAtIndex'),
    dirty: isFormDirty('edit-stage')(state),
    invalid: isFormInvalid('edit-stage')(state),
  });
};
const mapDispatchToProps = dispatch => ({
  continue: () => dispatch(submitForm('edit-stage')),
  updateStage: bindActionCreators(stageActions.updateStage, dispatch),
  createStage: bindActionCreators(stageActions.createStage, dispatch),
});

export { EditStage };

export default connect(mapStateToProps, mapDispatchToProps)(EditStage);
