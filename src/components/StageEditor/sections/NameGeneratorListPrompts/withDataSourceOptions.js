import { connect } from 'react-redux';
import {
  makeGetExternalDataPropertyOptions,
  makeGetDataSourcesWithNodeTypeOptions,
} from './selectors';

/**
 * Provides `externalDataPropertyOptions`, and `dataSources` options ({ label, value }) props
 */
const makeMapStateToProps = () => {
  const getExternalDataPropertyOptions = makeGetExternalDataPropertyOptions();
  const getDataSourcesWithNodeTypeOptions = makeGetDataSourcesWithNodeTypeOptions();

  const mapStateToProps = (state, props) => ({
    dataSources: getDataSourcesWithNodeTypeOptions(state, props),
    externalDataPropertyOptions: getExternalDataPropertyOptions(state, props),
  });

  return mapStateToProps;
};

const withDataSourceOptions = connect(makeMapStateToProps);

export default withDataSourceOptions;
