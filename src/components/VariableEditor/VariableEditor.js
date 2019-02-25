import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withProps } from 'recompose';
import { get } from 'lodash';
import Editor from '../Editor';
import VariableFields from '../TypeEditor/VariableFields';
import { getVariableRegistry } from '../../selectors/protocol';
import { actionCreators as actions } from '../../ducks/modules/protocol/variableRegistry';

const formName = 'VARIABLE_EDITOR';

const mapStateToProps = (state, { entity, type, ...props }) => {
  if (!props.id) { return {}; }

  const variableRegistry = getVariableRegistry(state);
  const variable = get(variableRegistry, [entity, type, 'variables'], [])
    .find(({ id }) => id === props.id);

  return {
    initialValues: variable,
  };
};

const mapDispatchToProps = dispatch => ({
  updateVariable: bindActionCreators(actions.updateVariable, dispatch),
  createVarible: bindActionCreators(actions.createVariable, dispatch),
});

const VariableEditor = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withProps(({ entity, type, onComplete, createVariable, updateVariable }) => ({
    form: formName,
    component: VariableFields,
    onSubmit: (variable) => {
      if (!variable.id) {
        createVariable(entity, type, variable);
        onComplete();
      }

      const { id, ...rest } = variable;
      updateVariable(entity, type, id, rest);
      onComplete();
    },
  })),
)(Editor);

export { formName };

export default VariableEditor;
