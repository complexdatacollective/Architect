import { connect } from 'react-redux';
import {
  makeGetVariableOptions,
} from './selectors';

/**
 * Provides `variableOptions` options ({ label, value }) props
 */
const makeMapStateToProps = () => {
  const getVariableOptions = makeGetVariableOptions();

  const mapStateToProps = (state, props) => {
    const variableOptions = getVariableOptions(state, props);
    const categoricalVariableOptions = variableOptions
      .filter(({ type }) => type === 'categorical');

    return {
      variableOptions,
      categoricalVariableOptions,
    };
  };

  return mapStateToProps;
};

const withVariableOptions = connect(makeMapStateToProps);

export default withVariableOptions;
