import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  isDirty as isFormDirty,
  isInvalid as isFormInvalid,
} from 'redux-form';
import { compose, defaultProps, withHandlers } from 'recompose';
import { find, isArray, isObject, toPairs, isNull, isEmpty } from 'lodash';
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

const assignForType = (memo, key, value) => {
  if (isArray(memo)) {
    return [
      ...memo,
      value,
    ];
  }

  return {
    ...memo,
    [key]: value,
  };
};

let prune;

const shouldPrune = x =>
  isNull(x) || (isObject(x) && isEmpty(x)) || (isArray(x) && x.length === 0);

const getNextValue = (value) => {
  if (isObject(value) || isArray(value)) {
    return prune(value);
  }

  return value;
};

prune = obj =>
  toPairs(obj).reduce(
    (memo, [key, value]) => {
      const nextValue = getNextValue(value);

      // Ditch nulls and empties
      if (shouldPrune(nextValue)) { return memo; }

      return assignForType(memo, key, nextValue);
    },
    (isArray(obj) ? [] : {}),
  );

const stageEditorState = connect(mapStateToProps, mapDispatchToProps);

const stageEditorHanders = withHandlers({
  onSubmit: ({ id, insertAtIndex, updateStage, createStage, onComplete }) =>
    (stage) => {
      if (id) {
        updateStage(id, prune(stage));
      } else {
        createStage(prune(stage), insertAtIndex);
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
