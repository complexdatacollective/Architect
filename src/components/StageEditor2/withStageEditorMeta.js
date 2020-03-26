import { connect } from 'react-redux';
import {
  isDirty as isFormDirty,
  isInvalid as isFormInvalid,
} from 'redux-form';
import { find } from 'lodash';
import { getProtocol } from '../../selectors/protocol';
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
    // dirty: isFormDirty(formName)(state),
    // invalid: isFormInvalid(formName)(state),
  });
};

const withStageEditorMeta = connect(mapStateToProps);

export default withStageEditorMeta;
