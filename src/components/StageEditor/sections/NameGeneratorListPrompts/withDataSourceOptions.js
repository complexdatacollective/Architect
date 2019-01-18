import { connect } from 'react-redux';
import {
  getNetworkOptions,
  makeGetExternalDataPropertyOptions,
} from './selectors';

/**
 * Provides `externalDataPropertyOptions`, and `dataSources` options ({ label, value }) props
 */
const makeMapStateToProps = () => {
  const getExternalDataPropertyOptions = makeGetExternalDataPropertyOptions();

  const mapStateToProps = (state, props) => ({
    dataSources: getNetworkOptions(state),
    externalDataPropertyOptions: getExternalDataPropertyOptions(state, props),
  });

  return mapStateToProps;
};

const withDataSourceOptions = connect(makeMapStateToProps);

export default withDataSourceOptions;
