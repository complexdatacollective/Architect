import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withProps } from 'recompose';
import { get } from 'lodash';
import Editor from '../Editor';
import VariableFields from '../TypeEditor/VariableFields';
import { getCodebook } from '../../selectors/protocol';
import { actionCreators as actions } from '../../ducks/modules/protocol/codebook';

export const formName = 'codebook';

const mapStateToProps = (state, { entity, type, ...props }) => {
  if (!props.id) { return {}; }

  const codebook = getCodebook(state);
  const variable = get(codebook, [entity, type, 'variables'], [])
    .find(({ id }) => id === props.id);

  return {
    initialValues: variable,
  };
};

const mapDispatchToProps = dispatch => ({
  updateVariable: bindActionCreators(actions.updateVariable, dispatch),
  createVariable: bindActionCreators(actions.createVariable, dispatch),
});

/**
 * An extended <Editor />, with preconfigured props (form, onSubmit, component).
 */
const VariableEditor = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withProps(({ entity, type, onComplete, createVariable, updateVariable }) => ({
    form: formName,
    component: VariableFields,
    onSubmit: (options) => {
      if (!options.id) {
        const newVariable = createVariable(entity, type, options);
        onComplete(newVariable);
      } else {
        const id = options.id;
        updateVariable(entity, type, id, options);
        onComplete({ entity, type, variable: id });
      }
    },
  })),
)(Editor);

export default VariableEditor;
