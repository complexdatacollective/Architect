import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  isDirty as isFormDirty,
  isInvalid as isFormInvalid,
} from 'redux-form';
import { compose, defaultProps, withHandlers } from 'recompose';
import { find } from 'lodash';
import { getProtocol } from '../../selectors/protocol';
import { actionCreators as stageActions } from '../../ducks/modules/protocol/stages';
import StageEditor, { formName } from './StageEditor';
import { getInterface } from './Interfaces';

const getStageById = (protocol, id) =>
  find(protocol.stages, ['id', id]);

const mapStateToProps = (state, props) => {
  const protocol = getProtocol(state);
  const stage = getStageById(protocol, props.id);
  const type = (stage && stage.type) || props.type;
  const template = getInterface(type).template || {};
  const initialValues = getStageById(protocol, props.id) ||
    { ...template, type };

  return ({
    initialValues,
    interfaceType: type,
    dirty: isFormDirty(formName)(state),
    invalid: isFormInvalid(formName)(state),
  });
};

const mapDispatchToProps = dispatch => ({
  updateStage: bindActionCreators(stageActions.updateStage, dispatch),
  createStage: bindActionCreators(stageActions.createStage, dispatch),
});

const stageEditorState = connect(mapStateToProps, mapDispatchToProps);

const stageEditorHanders = withHandlers({
  onSubmit: ({ id, insertAtIndex, updateStage, createStage, onComplete }) =>
    (stage) => {
      if (id) {
        updateStage(id, stage);
      } else {
        createStage(stage, insertAtIndex);
      }
      onComplete();
    },
});

export { formName };

export default compose(
  defaultProps({
    form: formName,
  }),
  stageEditorState,
  stageEditorHanders,
)(StageEditor);
