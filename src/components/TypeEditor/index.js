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

  const isNew = !type;

  const variables = getFormValue(state, 'variables') || {};
  const displayVariables = compact(map(variables, variable => ({
    label: variable.name,
    value: variable.id,
  })));

  return {
    initialValues,
    displayVariables,
    isNew,
  };
}

const mapDispatchToProps = dispatch => ({
  updateType: (entity, type, form) =>
    dispatch(codebookActions.updateType(entity, type, parse(form))),
  createType: (entity, form) =>
    dispatch(codebookActions.createType(entity, parse(form))),
});

const withTypeProps = withProps({
  form: formName,
  component: TypeEditor,
});

const withTypeState = connect(mapStateToProps, mapDispatchToProps);

const withTypeHandlers = withHandlers({
  onSubmit: ({ createType, updateType, onComplete, category: entity, type }) =>
    (values) => {
      let result;
      if (!type) {
        result = createType(entity, values);
      } else {
        result = updateType(entity, type, values);
      }

      onComplete(result);
    },
});

export { formName };

export default compose(
  withTypeState,
  withTypeProps,
  withTypeHandlers,
)(Editor);
