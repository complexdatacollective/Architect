import { connect } from 'react-redux';
import { getVariableOptionsForSubject } from '../../../selectors/codebook';

const mapStateToProps = (state, { type, entity }) => {
  const variableOptions = getVariableOptionsForSubject(state, { type, entity });

  return {
    variableOptions,
  };
};

const withVariableOptions = connect(
  mapStateToProps,
);

export default withVariableOptions;
