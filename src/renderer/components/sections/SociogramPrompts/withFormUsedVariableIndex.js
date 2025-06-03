import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { utils } from '../../../selectors/indexes';

const mapStateToProps = (state, props) => {
  const getFormValues = formValueSelector(props.form);
  const prompts = getFormValues(state, 'prompts');
  const formUsedVariableIndex = utils.collectPath('prompts[].highlight.variable', { prompts });

  return {
    formUsedVariableIndex,
  };
};

const withFormUsedVariableIndex = connect(
  mapStateToProps,
);

export default withFormUsedVariableIndex;
