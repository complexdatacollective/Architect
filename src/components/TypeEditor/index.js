import { connect } from 'react-redux';
import { get } from 'lodash';
import { compose, withProps, withHandlers } from 'recompose';
import Editor from '../Editor';
import { getProtocol } from '../../selectors/protocol';
import { actionCreators as codebookActions } from '../../ducks/modules/protocol/codebook';
import getNewTypeTemplate from './getNewTypeTemplate';
import { parse, format } from './convert';
import TypeEditor from './TypeEditor';

const formName = 'TYPE_EDITOR';

function mapStateToProps(state, props) {
  const { entity } = props;
  const { type } = props;
  const protocol = getProtocol(state);

  const initialValues = format(
    get(
      protocol,
      ['codebook', entity, type],
      getNewTypeTemplate({ protocol, entity }),
      {},
    ),
  );

  const isNew = !type;

  return {
    initialValues,
    isNew,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateType: (
    entity, type, form,
  ) => dispatch(codebookActions.updateType(entity, type, parse(form))),
  createType: (entity, form) => dispatch(codebookActions.createType(entity, parse(form))),
});

const withTypeProps = withProps({
  form: formName,
  component: TypeEditor,
});

const withTypeState = connect(mapStateToProps, mapDispatchToProps);

const withTypeHandlers = withHandlers({
  onSubmit: ({
    createType,
    updateType,
    onComplete,
    entity,
    type,
  }) => async (values) => {
    if (!type) {
      return createType(entity, values)
        .then(onComplete);
    }
    return updateType(entity, type, values)
      .then(onComplete);
  },
});

export { formName };

export default compose(
  withTypeState,
  withTypeProps,
  withTypeHandlers,
)(Editor);
