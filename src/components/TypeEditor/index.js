import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { compact, map, get } from 'lodash';
import { compose, withProps, withHandlers } from 'recompose';
import Editor from '../Editor';
import { getProtocol } from '../../selectors/protocol';
import { actionCreators as codebookActions } from '../../ducks/modules/protocol/codebook';
import getNewTypeTemplate from './getNewTypeTemplate';
import { parse, format } from './convert';
import TypeEditor from './TypeEditor';

const formName = 'TYPE_EDITOR';

function mapStateToProps(state, props) {
  const category = props.category;
  const type = props.type;
  const getFormValue = formValueSelector(formName);
  const protocol = getProtocol(state);

  const initialValues = format(
    get(
      protocol,
      ['codebook', category, type],
      getNewTypeTemplate({ protocol, category }),
      {},
    ),
  );

  const variables = getFormValue(state, 'variables') || {};
  const displayVariables = compact(map(variables, variable => ({
    label: variable.name,
    value: variable.id,
  })));

  return {
    initialValues,
    displayVariables,
  };
}

const mapDispatchToProps = dispatch => ({
  updateType: (category, type, form) =>
    dispatch(codebookActions.updateType(category, type, parse(form))),
  createType: (category, form) =>
    dispatch(codebookActions.createType(category, parse(form))),
});

const withTypeProps = withProps({
  form: formName,
  component: TypeEditor,
});

const withTypeState = connect(mapStateToProps, mapDispatchToProps);

const withTypeHandlers = withHandlers({
  onSubmit: ({ createType, updateType, onComplete, category, type }) =>
    (form) => {
      let entity;

      if (!type) {
        entity = createType(category, form);
      } else {
        entity = updateType(category, type, form);
      }

      onComplete(entity);
    },
});

export { formName };

export default compose(
  withTypeState,
  withTypeProps,
  withTypeHandlers,
)(Editor);
