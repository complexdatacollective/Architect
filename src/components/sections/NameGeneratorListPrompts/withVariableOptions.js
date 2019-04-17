import { connect } from 'react-redux';
import { getVariableOptionsForSubject } from '../../../selectors/codebook';


const mapStateToProps = (state, { entity, type }) => {
  const variableOptions = getVariableOptionsForSubject(state, { entity, type });

  return {
    variableOptions,
  };
};

const withVariableOptions = connect(
  mapStateToProps,
);

export default withVariableOptions;
