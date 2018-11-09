import { connect } from 'react-redux';
import { isDirty, isValid, formValueSelector } from 'redux-form';
import { compact, map } from 'lodash';
import { compose, withProps } from 'recompose';
import Editor from '../Editor';
import TypeEditor from './TypeEditor';

const formName = 'VARIABLE_REGISTRY';

const getFormValue = formValueSelector(formName);
const getIsDirty = isDirty(formName);
const getIsValid = isValid(formName);

const mapStateToProps = (state) => {
  const variables = getFormValue(state, 'variables') || {};
  const displayVariables = compact(map(variables, variable => ({
    label: variable.label,
    value: variable.id,
  })));

  return {
    dirty: getIsDirty(state),
    valid: getIsValid(state),
    displayVariables,
  };
};

export { formName };
export { parse, format } from './convert';

export default compose(
  connect(mapStateToProps),
  withProps(() => ({ form: formName, component: TypeEditor })),
)(Editor);
