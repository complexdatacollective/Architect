import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { change } from 'redux-form';
import { actionCreators as codebookActions } from '../../../ducks/modules/protocol/codebook';
import { getTypeForComponent } from '../../Form/inputOptions';
import { getCodebookProperties } from './helpers';

const fieldChangeHandlers = withHandlers({
  handleChangeFields: ({ createVariable, updateVariable, type, entity, changeForm, form }) =>
    (values) => {
      const { variable, component, ...rest } = values;
      const variableType = getTypeForComponent(component);
      // prune properties that are not part of the codebook:
      const codebookProperties = getCodebookProperties(rest);
      const configuration = {
        type: variableType,
        ...codebookProperties,
      };

      changeForm(form, '_modified', new Date().getTime()); // Register a change in the stage editor

      if (variable) {
        updateVariable(entity, type, variable, configuration);
        return values;
      }

      const result = createVariable(entity, type, configuration);
      return { ...values, variable: result.variable };
    },
});

const mapDispatchToProps = {
  changeForm: change,
  createVariable: codebookActions.createVariable,
  updateVariable: codebookActions.updateVariable,
};

const withFieldChangeHandlers = compose(
  connect(null, mapDispatchToProps),
  fieldChangeHandlers,
);

export default withFieldChangeHandlers;
