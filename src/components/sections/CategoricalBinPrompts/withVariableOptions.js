import { connect } from 'react-redux';
import { change, formValueSelector } from 'redux-form';
import { compose, lifecycle } from 'recompose';
import { get } from 'lodash';
import { getVariableOptionsForSubject, getVariablesForSubject } from '@selectors/codebook';

const mapStateToProps = (state, { form, type, entity }) => {
  const variableOptions = getVariableOptionsForSubject(
    state,
    { type, entity },
  );

  const variable = formValueSelector(form)(state, 'variable');
  const otherVariable = formValueSelector(form)(state, 'otherVariable');
  const variables = getVariablesForSubject(state, { type, entity });
  const optionsForVariable = get(variables, [variable, 'options'], []);
  const optionsForVariableDraft = formValueSelector(form)(state, 'variableOptions');

  return {
    variable,
    otherVariable,
    variableOptions,
    optionsForVariable,
    optionsForVariableDraft,
  };
};

const mapDispatchToProps = {
  changeForm: change,
};

const variableOptions = connect(mapStateToProps, mapDispatchToProps);

// Fix to keep redux 'sub-form' fields in sync
const updateFormVariableOptions = lifecycle({
  componentDidUpdate(previousProps) {
    const {
      changeForm,
      form,
      optionsForVariable,
      variable,
    } = this.props;
    if (previousProps.variable === variable) { return; }
    changeForm(form, 'variableOptions', optionsForVariable);// TODO: is this wrong field name?
  },
});

const withVariableOptions = compose(
  variableOptions,
  updateFormVariableOptions,
);

export default withVariableOptions;
