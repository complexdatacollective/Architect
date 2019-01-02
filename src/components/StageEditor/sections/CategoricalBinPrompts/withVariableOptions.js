import { connect } from 'react-redux';
import {
  makeGetVariableOptions,
} from './selectors';

/**
 * Provides `variableOptions` options ({ label, value }) props
 */
const makeMapStateToProps = () => {
  const getVariableOptions = makeGetVariableOptions();

  const mapStateToProps = (state, props) => ({
    variableOptions: getVariableOptions(state, props),
  });

  return mapStateToProps;
};

const withVariableOptions = connect(makeMapStateToProps);

export default withVariableOptions;
