import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { formValueSelector, change } from 'redux-form';
import { compose, withProps, withHandlers } from 'recompose';
import { map, get } from 'lodash';
import { getVariablesForNodeType, getNodeTypes } from '../../selectors/variableRegistry';
import { getProtocol } from '../../selectors/protocol';
import { actionCreators as formActions } from '../../ducks/modules/protocol/forms';
import Editor from '../Editor';
import FormEditor from './FormEditor';

const formName = 'EDIT_FORM';

const getFormValue = formValueSelector(formName);

const getNameFromTitle = title => title.replace(/\W/g, '');

const mapStateToProps = (state, props) => {
  const protocol = getProtocol(state);
  const nodeType = getFormValue(state, 'type') || null;
  const formId = props.id;
  const initialValues = get(protocol, ['forms', formId]);
  const nodeTypes = map(
    getNodeTypes(state),
    (nodeOptions, optionNodeType) => ({
      label: get(nodeOptions, 'label', ''),
      value: optionNodeType,
      color: get(nodeOptions, 'color', ''),
    }),
  );

  return {
    initialValues,
    nodeType,
    nodeTypes,
    variables: getVariablesForNodeType(state, nodeType),
  };
};

const mapDispatchToProps = dispatch => ({
  resetFields: () => {
    dispatch(change(formName, 'type', null));
    dispatch(change(formName, 'fields', null));
  },
  updateForm: bindActionCreators(formActions.updateForm, dispatch),
  createForm: bindActionCreators(formActions.createForm, dispatch),
});

const withEditorState = connect(mapStateToProps, mapDispatchToProps);

const withEditorProps = withProps({
  form: formName,
  component: FormEditor,
});

const withEditorHandlers = withHandlers({
  onSubmit: ({ updateForm, createForm, onComplete, ...props }) =>
    (form) => {
      if (props.id) {
        updateForm(props.id, form);
      } else {
        createForm(getNameFromTitle(form.title), form);
      }

      onComplete({
        formName: props.id || getNameFromTitle(form.title),
        form,
      });
    },
});

export { formName };

export default compose(
  withEditorState,
  withEditorProps,
  withEditorHandlers,
)(Editor);
