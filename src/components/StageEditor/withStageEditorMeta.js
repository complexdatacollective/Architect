import { connect } from 'react-redux';
import {
  isDirty as isFormDirty,
  isInvalid as isFormInvalid,
  getFormValues,
} from 'redux-form';
import { has } from 'lodash';
import { getStage, getStageIndex } from '@selectors/protocol';
import { getInterface } from './Interfaces';
import { formName } from './configuration';

const getStagePathById = (state, id) => {
  const stageIndex = getStageIndex(state, id);

  const stagePath = stageIndex !== -1
    ? `stages[${stageIndex}]`
    : null;

  return stagePath;
};

const mapStateToProps = (state, props) => {
  const stage = getStage(state, props.id);
  const stagePath = getStagePathById(state, props.id);
  const type = (stage && stage.type) || props.type;
  const template = getInterface(type).template || {};
  const initialValues = stage || { ...template, type };
  const formValues = getFormValues(formName)(state);
  const hasSkipLogic = has(formValues, 'skipLogic.action');

  return ({
    initialValues,
    stagePath,
    interfaceType: type,
    dirty: isFormDirty(formName)(state),
    invalid: isFormInvalid(formName)(state),
    hasSkipLogic,
  });
};

const withStageEditorMeta = connect(mapStateToProps);

export default withStageEditorMeta;
