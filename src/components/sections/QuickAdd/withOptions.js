import { connect } from 'react-redux';
import { getVariableOptionsForSubject } from '@selectors/codebook';

const mapStateToProps = (state, { entity, type }) => {
  const variableOptionsForSubject = getVariableOptionsForSubject(state, { entity, type });

  const textOptionsForSubject = variableOptionsForSubject
    .filter(({ type: variableType }) => variableType === 'text');

  return {
    options: textOptionsForSubject,
  };
};

const withOptions = connect(mapStateToProps, {});

export default withOptions;
