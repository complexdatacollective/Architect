import { connect } from 'react-redux';
import {
  isDirty as isFormDirty,
  isInvalid as isFormInvalid,
} from 'redux-form';
import { find, findIndex } from 'lodash';
import { getProtocol } from '../../selectors/protocol';
import { formName } from './StageEditor';
import { getInterface } from './Interfaces';

const getStageById = (protocol, id) =>
  find(protocol.stages, ['id', id]);

const getStageIndexById = (protocol, id) =>
  findIndex(protocol.stages, ['id', id]);

const getStagePathById = (protocol, id) => {
  const stageIndex = getStageIndexById(protocol, id);

  const stagePath = stageIndex !== -1 ?
    `stages[${stageIndex}]` :
    null;

  return stagePath;
};

const mapStateToProps = (state, props) => {
  const protocol = getProtocol(state);
  const stage = getStageById(protocol, props.id);
  const stagePath = getStagePathById(protocol, props.id);
  const type = (stage && stage.type) || props.type;
  const template = getInterface(type).template || {};
  const initialValues = getStageById(protocol, props.id) || { ...template, type };

  return ({
    initialValues,
    stagePath,
    interfaceType: type,
    dirty: isFormDirty(formName)(state),
    invalid: isFormInvalid(formName)(state),
  });
};

const withStageEditorMeta = connect(mapStateToProps);

export default withStageEditorMeta;
