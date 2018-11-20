import { difference, keys } from 'lodash';
import { connect } from 'react-redux';

const mapStateToProps = (state, { input: { value }, variablesForNodeType }) => {
  const unusedVariables = difference(keys(variablesForNodeType), keys(value));

  return ({
    unusedVariables,
  });
};

export default connect(mapStateToProps);
