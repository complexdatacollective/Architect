import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { parse as parseQueryString } from 'query-string';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { remote, ipcRenderer } from 'electron';
import { compose } from 'recompose';
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
import { actionCreators as previewActions } from '../../ducks/modules/preview';

const insertAtIndex = query =>
  (query.insertAtIndex ? parseInt(query.insertAtIndex, 10) : null);

const formName = 'edit-stage';

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

  componentDidMount() {
    ipcRenderer.on('REFRESH_PREVIEW', this.handlePreview);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('REFRESH_PREVIEW', this.handlePreview);
  }

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

  get secondaryButtons() {
    return [
      <Button
        key="preview"
        onClick={this.handlePreview}
        color="paradise-pink"
      >Preview</Button>,
    ];
  }

  handlePreview = () => this.props.previewStage();

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
        secondaryButtons={this.secondaryButtons}
        show={show}
        onCancel={this.handleCancel}
      >
        <StageEditor
          stage={stage}
          form={formName}
          onSubmit={this.handleSubmit}
          previewStage={this.props.previewStage}
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
    insertAtIndex: insertAtIndex(query),
    dirty: isFormDirty(formName)(state),
    invalid: isFormInvalid(formName)(state),
  });
};

const mapDispatchToProps = dispatch => ({
  submitForm: () => dispatch(submitForm(formName)),
  updateStage: bindActionCreators(stageActions.updateStage, dispatch),
  createStage: bindActionCreators(stageActions.createStage, dispatch),
  previewStage: () => dispatch(previewActions.previewStageByFormName(formName)),
});

export { EditStage };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(EditStage);
