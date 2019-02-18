import { connect } from 'react-redux';
import {
  formValueSelector,
  change,
  isDirty,
  isValid,
} from 'redux-form';
import { compose, withProps } from 'recompose';
import { map, get } from 'lodash';
import { getVariablesForNodeType, getNodeTypes } from '../../selectors/codebook';
import Editor from '../Editor';
import FormEditor from './FormEditor';

const formName = 'EDIT_FORM';
const getFormValue = formValueSelector(formName);
const getIsDirty = isDirty(formName);
const getIsValid = isValid(formName);

const mapStateToProps = (state) => {
  const formNodeType = getFormValue(state, 'type') || null;

  return {
    nodeType: formNodeType,
    nodeTypes: map(
      getNodeTypes(state),
      (nodeOptions, nodeType) => ({
        label: get(nodeOptions, 'label', ''),
        value: nodeType,
        color: get(nodeOptions, 'color', ''),
      }),
    ),
    variables: getVariablesForNodeType(state, formNodeType),
    dirty: getIsDirty(state),
    valid: getIsValid(state),
  };
};

const mapDispatchToProps = dispatch => ({
  resetFields: () => {
    dispatch(change(formName, 'type', null));
    dispatch(change(formName, 'fields', null));
  },
});

export { formName };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withProps(() => ({ form: formName, component: FormEditor })),
)(Editor);
