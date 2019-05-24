import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { change } from 'redux-form';
import { actionCreators as codebookActions } from '../../../ducks/modules/protocol/codebook';
import { getTypeForComponent } from '../../Form/inputOptions';
import { getCodebookProperties } from './helpers';

const formHandlers = withHandlers({
  handleChangeFields: ({ updateVariable, type, entity, changeForm, form }) =>
    (values) => {
      const { variable, component, ...rest } = values;
      const variableType = getTypeForComponent(component);
      // prune properties that are not part of the codebook:
      const codebookProperties = getCodebookProperties(rest);
      const configuration = {
        type: variableType,
        component,
        ...codebookProperties,
      };

      // Register a change in the stage editor
      // `form` here refers to the `section/` parent form, not the fields form
      changeForm(form, '_modified', new Date().getTime());

      updateVariable(entity, type, variable, configuration, true);
      return values;
    },
});

const mapDispatchToProps = {
  changeForm: change,
  updateVariable: codebookActions.updateVariable,
};

const formState = connect(null, mapDispatchToProps);

export {
  formState,
  formHandlers,
};

export default compose(
  formState,
  formHandlers,
);
